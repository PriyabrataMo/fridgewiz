import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateRecipeFromImages, continueConversation } from "@/lib/openai";
import { processAndUploadImage } from "@/lib/image-utils";
import { nanoid } from "nanoid";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth();

    const formData = await request.formData();
    const conversationId = formData.get("conversationId") as string;
    const message = formData.get("message") as string;
    const files = formData.getAll("images") as File[];

    if (!conversationId || !message) {
      return NextResponse.json(
        { error: "conversationId and message are required" },
        { status: 400 },
      );
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
        userId: user.id, // Ensure user can only add messages to their own conversations
      },
      include: {
        messages: {
          include: {
            images: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    const processedImages = [];

    for (const file of files) {
      if (file instanceof File) {
        try {
          const uploadedImage = await processAndUploadImage(file);
          processedImages.push(uploadedImage);
        } catch (error) {
          console.error("Error uploading image:", error);
          return NextResponse.json(
            { error: `Failed to upload image: ${file.name}` },
            { status: 400 },
          );
        }
      }
    }

    const userMessage = await prisma.message.create({
      data: {
        id: nanoid(),
        conversationId,
        role: "USER",
        content: message,
        images: {
          create: processedImages.map((img) => ({
            id: nanoid(),
            filename: img.filename,
            mimeType: img.mimeType,
            s3Key: img.s3Key,
            url: img.url,
            size: img.size,
            width: img.width || 0,
            height: img.height || 0,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    const conversationHistory = conversation.messages.map((msg) => ({
      role: msg.role.toLowerCase() as "user" | "assistant" | "system",
      content: msg.content,
    }));

    const imageUrls = processedImages.map((img) => img.url);

    let aiResponse: string;
    if (imageUrls.length > 0) {
      aiResponse = await generateRecipeFromImages(
        imageUrls,
        message,
        conversationHistory,
      );
    } else {
      aiResponse = await continueConversation(message, conversationHistory);
    }

    const assistantMessage = await prisma.message.create({
      data: {
        id: nanoid(),
        conversationId,
        role: "ASSISTANT",
        content: aiResponse,
      },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      userMessage,
      assistantMessage,
      conversation: {
        id: conversationId,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    console.error("Error processing chat message:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth();

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId is required" },
        { status: 400 },
      );
    }

    // Verify the conversation belongs to the user
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
        userId: user.id,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        images: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

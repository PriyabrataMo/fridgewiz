import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/db";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

    if (!webhookSecret) {
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 },
      );
    }
    const headerPayload = request.headers;
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error occurred -- no svix headers", {
        status: 400,
      });
    }

    // Get the body
    const payload = await request.text();
    const body = JSON.parse(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(webhookSecret);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occurred", {
        status: 400,
      });
    }

    const eventType = evt.type;

    // console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
    console.log("Webhook body:", body);

    switch (eventType) {
      case "user.created":
        const { id, email_addresses, first_name, last_name, image_url } =
          evt.data;
        try {
          await prisma.user.create({
            data: {
              clerkId: id as string,
              email: email_addresses?.[0]?.email_address || null,
              name:
                first_name && last_name
                  ? `${first_name} ${last_name}`
                  : first_name || last_name || null,
              avatar: image_url || null,
            },
          });
          console.log(`User ${id} created in database`);
        } catch (error) {
          console.error("Error creating user:", error);
          // Don't return error to Clerk to avoid retries
        }
        break;

      case "user.updated":
        try {
          const { id, email_addresses, first_name, last_name, image_url } =
            evt.data;
          await prisma.user.upsert({
            where: { clerkId: id },
            update: {
              email: email_addresses?.[0]?.email_address || null,
              name:
                first_name && last_name
                  ? `${first_name} ${last_name}`
                  : first_name || last_name || null,
              avatar: image_url || null,
            },
            create: {
              clerkId: id as string,
              email: email_addresses?.[0]?.email_address || null,
              name:
                first_name && last_name
                  ? `${first_name} ${last_name}`
                  : first_name || last_name || null,
              avatar: image_url || null,
            },
          });
          console.log(`User ${id} updated in database`);
        } catch (error) {
          console.error("Error updating user:", error);
          // Don't return error to Clerk to avoid retries
        }
        break;

      case "user.deleted":
        try {
          const { id } = evt.data;
          await prisma.user.delete({
            where: { clerkId: id },
          });
          console.log(`User ${id} deleted from database`);
        } catch (error) {
          console.error("Error deleting user:", error);
          // Don't return error to Clerk to avoid retries
        }
        break;

      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateRecipeFromImages(
  images: string[],
  prompt: string,
  conversationHistory: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>,
) {
  const systemPrompt = `You are FridgeWiz AI, a specialized cooking assistant that analyzes ingredient photos and creates personalized recipes. 

Key capabilities:
- Identify ingredients from photos with high accuracy
- Suggest creative, practical recipes based on available ingredients
- Consider dietary preferences and restrictions
- Provide step-by-step cooking instructions
- Estimate cooking times and difficulty levels
- Offer ingredient substitutions when possible

Always respond in a friendly, helpful tone and focus on making cooking accessible and enjoyable.`;

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: systemPrompt,
    },
    ...conversationHistory.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  ];

  if (images.length > 0) {
    const imageContent: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [
      {
        type: "text",
        text: prompt,
      },
      ...images.map((image) => ({
        type: "image_url" as const,
        image_url: {
          url: image,
        },
      })),
    ];

    messages.push({
      role: "user",
      content: imageContent,
    });
  } else {
    messages.push({
      role: "user",
      content: prompt,
    });
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    max_tokens: 1500,
    temperature: 0.7,
  });

  return (
    response.choices[0]?.message?.content ||
    "Sorry, I could not generate a response."
  );
}

export async function continueConversation(
  prompt: string,
  conversationHistory: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>,
  images?: string[],
) {
  return generateRecipeFromImages(images || [], prompt, conversationHistory);
}

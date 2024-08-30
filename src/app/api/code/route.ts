import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { config } from 'dotenv';

config(); // Load environment variables

// Ensure the API key is loaded
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("OPENAI_API_KEY is missing from environment variables.");
  throw new Error("OPENAI_API_KEY is not configured.");
}

const openai = new OpenAI({
  apiKey,
});

// Define the instruction message inline
const instructionMessage = {
  role: "system",
  content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations.",
};

// Export the POST function to handle POST requests
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    console.log("User ID:", userId);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages must be a non-empty array." }, { status: 400 });
    }

    console.log("Sending messages to OpenAI:", messages);

    // Call the OpenAI API to create a chat completion
    const response = await openai.chat.completions.create({
      model: "gpt-4", // Ensure this is the correct model name
      messages: [instructionMessage, ...messages],
    });

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content returned from OpenAI:", response);
      return NextResponse.json({ error: "No content returned from OpenAI." }, { status: 500 });
    }

    return NextResponse.json({ content }, { status: 200 });

  } catch (error: any) {
    console.error("[CODE_ERROR]:", error.message);
    if (error instanceof Error) {
      console.error("Stack trace:", error.stack);
    }

    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { config } from 'dotenv';
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

config(); // Load environment variables

// Ensure the API key is loaded correctly
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
    // Perform authentication check early
    const { userId } = auth();
    console.log("User ID:", userId);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please log in to access this service." }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages must be a non-empty array." }, { status: 400 });
    }

    // Check API usage limits
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to a paid plan.", { status: 403 });
    }

    console.log("Sending messages to OpenAI:", messages);

    // Call the OpenAI API to create a chat completion
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [instructionMessage, ...messages], // Include the system message
    });

    if(!isPro){
    await increaseApiLimit();
    }

    // Extract the response content safely
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

    return NextResponse.json({ error: "Internal server error. Please try again later." }, { status: 500 });
  }
}

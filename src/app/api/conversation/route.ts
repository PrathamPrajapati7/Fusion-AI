import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
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

const MAX_RETRIES = 7; // Maximum number of retries
const INITIAL_DELAY = 1500; // Initial delay in milliseconds
const MAX_DELAY = 60000; // Maximum delay in milliseconds

async function makeApiRequest(messages: any[], retries: number = 0): Promise<any> {
  try {
    console.log("Request Payload:", { model: "gpt-4", messages });

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
    });

    console.log("API Response Data:", response); // Log the entire response for debugging

    // Extract the response content based on the new structure
    const responseData = response.choices[0]?.message || null;

    if (!responseData) {
      throw new Error("Invalid response from AI.");
    }

    return responseData;
  } catch (error: any) {
    if (error.response) {
      console.error(`[CONVERSATION_ERROR]: Error response data:`, error.response.data);
      console.error(`[CONVERSATION_ERROR]: Error response status:`, error.response.status);
    } else {
      console.error(`[CONVERSATION_ERROR]:`, error.message);
    }

    if (error.response?.status === 429 && retries < MAX_RETRIES) {
      const delay = Math.min(INITIAL_DELAY * Math.pow(2, retries) + Math.random() * 1000, MAX_DELAY);
      console.warn(`[CONVERSATION_WARNING]: Rate limit exceeded. Retrying in ${delay}ms... (Attempt ${retries + 1})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return makeApiRequest(messages, retries + 1);
    } else {
      throw error; // Rethrow the error if not a 429 or max retries exceeded
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    console.log("User ID:", userId);

    if (!userId) {
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    const body = await req.json();
    const { messages } = body;

    if (!apiKey) {
      return new NextResponse("OpenAI API key not configured.", { status: 500 });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new NextResponse("Messages must be a non-empty array.", { status: 400 });
    }

    const response = await makeApiRequest(messages);

    return NextResponse.json({ content: response.content }, { status: 200 });

  } catch (error: any) {
    console.error("[CONVERSATION_ERROR]:", error.message);
    if (error instanceof Error) {
      console.error("Stack trace:", error.stack);
    }

    return new NextResponse("Internal server error.", { status: 500 });
  }
}

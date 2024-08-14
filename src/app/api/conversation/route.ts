import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import { config } from 'dotenv';

config();  // Ensure environment variables are loaded

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const MAX_RETRIES = 7; // Retry attempts
const INITIAL_DELAY = 1500; // Initial delay in milliseconds
const MAX_DELAY = 60000; // Maximum delay in milliseconds (60 seconds)

async function makeApiRequest(messages: any[], retries: number = 0): Promise<any> {
  try {
    // Log the request payload for debugging
    console.log("Request Payload:", { model: "gpt-3.5-turbo", messages });

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });

    return response.data.choices[0].message;
  } catch (error: any) {
    if (error.response) {
      console.error(`[CONVERSATION_ERROR]: Error response data:`, error.response.data);
      console.error(`[CONVERSATION_ERROR]: Error response status:`, error.response.status);
    } else {
      console.error(`[CONVERSATION_ERROR]:`, error.message);
    }

    if (error.response?.status === 429 && retries < MAX_RETRIES) {
      const delay = Math.min(INITIAL_DELAY * Math.pow(2, retries) + Math.random() * 1000, MAX_DELAY); // Capped delay
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
    console.log("User ID:", userId); // Log User ID for debugging
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API key not configured.", { status: 500 });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new NextResponse("Messages must be a non-empty array.", { status: 400 });
    }

    const message = await makeApiRequest(messages);
    return NextResponse.json(message, { status: 200 });

  } catch (error: any) {
    if (error instanceof Error) {
      console.error("[CONVERSATION_ERROR]:", error.message);
      console.error("Stack trace:", error.stack);
    } else {
      console.error("[CONVERSATION_ERROR]: An unknown error occurred.");
    }

    return new NextResponse("Internal server error.", { status: 500 });
  }
}

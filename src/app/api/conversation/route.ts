import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const MAX_RETRIES = 5; // Maximum number of retry attempts
const INITIAL_DELAY = 1000; // Initial delay in milliseconds

async function makeApiRequest(messages: any[], retries: number = 0): Promise<any> {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });
    return response.data.choices[0].message;
  } catch (error: any) {
    if (error.response?.status === 429 && retries < MAX_RETRIES) {
      // Exponential backoff
      const delay = INITIAL_DELAY * Math.pow(2, retries); // Increase delay exponentially
      console.warn(`[CONVERSATION_WARNING]: Rate limit exceeded. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return makeApiRequest(messages, retries + 1);
    } else {
      // Log the error details
      console.error("[CONVERSATION_ERROR]:", error.response?.data || error.message);
      throw error; // Rethrow the error if not a 429 or max retries exceeded
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) return new NextResponse("Unauthorized.", { status: 401 });
    if (!configuration.apiKey)
      return new NextResponse("OpenAI API key not configured.", { status: 500 });
    if (!messages)
      return new NextResponse("Messages are required.", { status: 400 });

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

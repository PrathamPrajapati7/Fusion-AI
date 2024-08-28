import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { config } from 'dotenv';

config();

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("OPENAI_API_KEY is not configured.");
}

const openai = new OpenAI({
  apiKey,
});

const validResolutions = ["256x256", "512x512", "1024x1024"];

export async function POST(req: NextRequest) {
  try {
    const { prompt, amount, resolution } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return new NextResponse("Prompt is required and must be a string", { status: 400 });
    }

    if (!amount || typeof amount !== 'string' || isNaN(Number(amount))) {
      return new NextResponse("Amount is required and must be a string representation of a number", { status: 400 });
    }

    if (!resolution || !validResolutions.includes(resolution)) {
      return new NextResponse("Invalid resolution", { status: 400 });
    }

    const response = await openai.images.generate({
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}

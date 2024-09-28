import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";

// Instantiate Replicate with API token
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized.", { status: 401 });

    const body = await req.json();
    const { prompt } = body;
    if (!prompt) return new NextResponse("Prompt is required.", { status: 400 });

    console.log("Prompt received:", prompt);

    const freeTrial = await checkApiLimit();

    if(!freeTrial){
      return new NextResponse("Free trial has expired. Please upgrade to a paid plan.", { status: 403
    });

  }

    // Run the model with the specific version provided
    const response = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",  // Using the specific version of the model
      { input: { prompt_b: prompt } }  // Match the input parameter to the model's requirement
    );

    console.log("Replicate API response:", response);

    await increaseApiLimit();
    
    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    console.error("[MUSIC_ERROR]: ", error);
    return new NextResponse("Internal server error.", { status: 500 });
  }
}

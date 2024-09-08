import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

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

    // Run the model with the specific version provided
    const response = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",  // Using the specific version of the model
      { input: 
        { prompt } }  // Match the input parameter to the model's requirement
    );

    console.log("Replicate API response:", response);
    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    console.error("[VIDEO_ERROR]: ", error);
    return new NextResponse("Internal server error.", { status: 500 });
  }
}

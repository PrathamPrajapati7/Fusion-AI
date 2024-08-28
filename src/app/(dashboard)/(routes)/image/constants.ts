import * as z from "zod";

// Define validation schema for form
export const formSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  amount: z.string().min(1, "Amount is required"), // Keep amount as string
  resolution: z.string().min(1, "Resolution is required"),
});

// Define options for amount and resolution
export const amountOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
];

export const resolutionOptions = [
  { value: "256x256", label: "256x256" },
  { value: "512x512", label: "512x512" },
  { value: "1024x1024", label: "1024x1024" },
];

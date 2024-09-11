"use client";

import { Empty } from "@/components/empty";
import { Heading } from "@/components/heading";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner"; // Assuming you have installed and set up sonner
import * as z from "zod";
import { formSchema } from "./constants";

const VideoPage = () => {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [videoUrl]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isSignedIn) {
      toast.error("You need to be signed in to generate video.");
      return;
    }

    try {
      setVideoUrl(null);

      // Make sure the request to the API includes the necessary headers
      const response = await axios.post("/api/video", values);

      console.log("API Response:", response.data);

      const videoUrl = response.data.video_url; // Ensure this key matches the API response

      if (!videoUrl) {
        console.error("No valid video URL in response:", response.data);
        form.setError("prompt", {
          message: "The AI did not return a valid video. Please try again.",
        });
        return;
      }

      setVideoUrl(videoUrl);
      form.reset();
    } catch (error: any) {
      console.error("Error during submission:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Video Generation"
        description="Turn your prompt into video"
        Icon={VideoIcon}
        iconColor="text-sky-500"
        bgColor="bg-sky-500/10"
      />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="
              rounded-lg
              border
              w-full
              p-4
              px-3
              md:px-6
              focus-within:shadow-sm
              grid
              grid-cols-12
              gap-2
            "
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="Clown fish swimming around a coral reef"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className="col-span-12 lg:col-span-2 w-full"
              disabled={isLoading || !isSignedIn}
            >
              Generate
            </Button>
          </form>
        </Form>
      </div>
      <div className="space-y-4 mt-4">
        {isLoading && (
          <div className="p-8 rounded-lg w-full flex items-center justify-center bg-gray-200">
            <Loader />
          </div>
        )}
        {!videoUrl && !isLoading && <Empty label="No Video generated." />}
        {videoUrl && (
          <video className="w-full aspect-video mt-8 rounded-lg border bg-black" controls>
            <source src={videoUrl} type="video/mp4" />
          </video>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default VideoPage;

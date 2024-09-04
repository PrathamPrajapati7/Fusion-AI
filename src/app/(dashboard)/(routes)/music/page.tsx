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
import { Music } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner"; // Assuming you have installed and set up sonner
import * as z from "zod";
import { formSchema } from "./constants";

interface ChatCompletionRequestMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const MusicPage = () => {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const [music, setMusic] = useState<string>();
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
  }, [music]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isSignedIn) {
      toast.error("You need to be signed in to generate music.");
      return;
    }

    try {
      setMusic(undefined);

      // Make sure the request to the API includes the necessary headers
      const response = await axios.post("/api/music", values);

      console.log("API Response:", response.data);

      const botMessageContent = response.data.content;

      if (!botMessageContent) {
        console.error("No valid response from the AI:", response.data);
        form.setError("prompt", {
          message: "The AI did not return a response. Please try again.",
        });
        return;
      }

      setMusic(response.data.audio);
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
        title="Music Generation"
        description="Turn your prompt into music"
        Icon={Music}
        iconColor="text-embrald-500"
        bgColor="bg-embrald-500/10"
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
                      placeholder="Piano solo"
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
        {!music && !isLoading && <Empty label="No Music generated." />}
        {music && (
          <audio controls className="w-full mt-8">
            <source src={music} />
          </audio>
        )}
      </div>
    </div>
  );
};

export default MusicPage;

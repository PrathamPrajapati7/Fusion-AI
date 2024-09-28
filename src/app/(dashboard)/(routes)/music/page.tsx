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
import { toast } from "sonner";
import * as z from "zod";
import { formSchema } from "./constants";
import { useProModal } from "../../../../../hooks/use-pro-modal";

const MusicPage = () => {
  const proModal= useProModal();
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
      setMusic(undefined); // Clear the previous audio

      const response = await axios.post("/api/music", values);

      console.log("API Response:", response.data);

      const audioUrl = response.data.audio;

      if (!audioUrl) {
        console.error("No valid audio URL returned:", response.data);
        form.setError("prompt", {
          message: "The AI did not return an audio URL. Please try again.",
        });
        return;
      }

      setMusic(audioUrl); // Update the state with the new audio URL
      form.reset();
    } catch (error: any) {
      if(error?.response?.status === 403){
        proModal.onOpen();
       }
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
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
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
                      placeholder="Enter your music prompt here"
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
        {!music && !isLoading && <Empty label="No music generated." />}
        {music && (
          <audio controls className="w-full mt-8">
            <source src={music} type="audio/mpeg" />
          </audio>
        )}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default MusicPage;

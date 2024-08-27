"use client";

import axios from "axios";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { toast } from "sonner"; // Assuming you have installed and set up `sonner`

interface ChatCompletionRequestMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const ConversationPage = () => {
  const router = useRouter();
  const [Messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
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
  }, [Messages]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...Messages, userMessage];

      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });

      console.log("API Response:", response.data);

      const botMessageContent = response.data.content;

      if (!botMessageContent) {
        console.error("No valid response from the AI:", response.data);
        form.setError("prompt", { message: "The AI did not return a response. Please try again." });
        return;
      }

      const botMessage: ChatCompletionRequestMessage = {
        role: "assistant",
        content: botMessageContent,
      };

      setMessages((current) => [...current, userMessage, botMessage]);
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
        title="Conversation"
        description="Our most advanced conversation tool"
        Icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
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
                      placeholder="How do I calculate the radius of a circle?"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
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
        {Messages.length === 0 && !isLoading && (
          <Empty label="No conversation started." />
        )}
        {Messages.length > 0 && (
          <div className="flex flex-col-reverse gap-y-4">
            {Messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 w-full flex items-start gap-x-4 rounded-lg",
                  message.role === "user"
                    ? "bg-white border border-gray-300"
                    : "bg-gray-100"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <p className="text-sm">{message.content}</p>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationPage;

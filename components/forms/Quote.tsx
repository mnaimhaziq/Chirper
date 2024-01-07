"use client";

import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CommentValidation } from "@/lib/validation/thread";
import { addCommentToThread, addQuoteThread } from "@/lib/actions/thread.action";
import { toast } from "react-toastify";
import { UploadButton } from "@/lib/uploadthing2";
import { useState } from "react";

interface Props {
    threadId: string;
    currentUserImg: string;
    currentUserId: string;
  }
const Quote = ({ threadId, currentUserImg, currentUserId }: Props) => {
  const pathname = usePathname();
  const [mediaLink, setMediaLink] = useState<string>("");

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    const quoteThread = await addQuoteThread(
      threadId,
      values.thread,
      mediaLink,
      JSON.parse(currentUserId),
      pathname
    );

    if (quoteThread) {
      toast.success("Quote sent successfully");
      form.reset();
    }
  };

  const getMediaType = (url?: string) => {
    const extension = url?.split(".").pop()?.toLowerCase();

    if (extension === "mp4" || extension === "webm") {
      return "video";
    }

    return "image";
  };

  const removeMedia = () => {
    setMediaLink(""); 
  };

  const mediaType = getMediaType(mediaLink);

  return (
    <Form {...form}>
    <form
        className="mt-10 flex flex-col gap-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="current_user"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent mb-5">
                <Input
                  type="text"
                  {...field}
                  placeholder="Quote..."
                  className="no-focus text-light-1 outline-none"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {mediaLink !== null && mediaLink !== "" ? (
          mediaType === "image" ? (
            <div className="mx-auto flex flex-col items-end">
            <button className ="dark:bg-primary-500 bg-lightmode-4 p-1 rounded-full w-7 h-7 text-center mb-2" onClick= {removeMedia}>
              <img src="/assets/delete1.svg" alt="Remove" width={20} height={20} /></button>
            <img
              src={mediaLink}
              alt="threadImage"
              width={400}
              height={200}
            />
            </div>
          ) : mediaType === "video" ? (
            <video className="mt-4 mx-auto" width={500} height={400} controls>
              <source src={mediaLink} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : null
        ) : null}

        <UploadButton
          className="mx-auto p-4 w-[250px] dark:ut-button:bg-primary-500 dark:ut-label:text-white dark:ut-upload-icon:text-black dark:ut-allowed-content:text-white
          ut-button:bg-lightmode-4 ut-label:text-black ut-upload-icon:text-black ut-allowed-content:text-black"
          endpoint="media"
          onClientUploadComplete={(res) => {
            if (res) {
              console.log("Files: ", res);
              setMediaLink(res[0].url);
            } else {
              console.warn("No files uploaded");
            }
          }}
          onUploadError={(error: Error) => {
            alert(`ERROR! ${error.message}`);
          }}
        />
        <div className="flex justify-end mb-2">
          <Button type="submit" className="comment-form_btn w-1/6 ">
            Quote
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default Quote;
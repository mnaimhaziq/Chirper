"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/lib/uploadthing2";
import { ThreadValidation } from "@/lib/validation/thread";
import { createThread } from "@/lib/actions/thread.action";
import { SetStateAction, useEffect, useState } from "react";
interface Props {
  userId: string;
}

function PostThread({ userId }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const { organization } = useOrganization();
  const [mediaLink, setMediaLink] = useState<string>("");
  const [mediaType, setMediaType] = useState<string | null>(null);

  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {

    await createThread({
      text: values.thread,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname,
      mediaLink: mediaLink,
    });

    router.push("/");
  };

  const removeMedia = () => {
    setMediaLink(""); 
  };

  useEffect(() => {
    const fetchMediaType = async () => {
      try {
        const response = await fetch(mediaLink);
        const contentType = response.headers.get("content-type");
        setMediaType(contentType);
      } catch (error) {
        console.error("Failed to fetch media type:", error);
      }
    };

    if (mediaLink.length) {
      fetchMediaType();
    }
  }, [mediaLink]);

  return (
    <Form {...form}>
      <form
        className='mt-10 flex flex-col justify-start gap-7'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold dark:text-light-2 text-dark-2'>
                Content
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 dark:bg-dark-3 bg-lightmode-1 dark:text-light-1 text-dark-1'>
                <Textarea rows={10} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {mediaLink.length > 0 && (
          <div className="mx-auto px-10 flex flex-col items-end ">
            <div className="mb-2">
              <button className="dark:bg-primary-500 bg-lightmode-4 p-1 rounded-full w-7 h-7 text-center" onClick={removeMedia}>
                <img src="/assets/delete1.svg" alt="Remove" width={20} height={20} />
              </button> 
            </div>
            {mediaType && mediaType.startsWith("image/") && (
              <img src={mediaLink} alt="Image" width={400} height={200} />
            )}
            {mediaType && mediaType.startsWith("video/") && (
              <video width={400} height={200} controls>
                <source src={mediaLink} type={mediaType} />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        )}

        <UploadDropzone
          className="mx-auto p-4 dark:bg-primary-500 bg-lightmode-4 dark:ut-button:bg-indigo-500 dark:ut-label:text-black ut-button:bg-lightmode-2
          dark:ut-upload-icon:text-black dark:ut-allowed-content:text-black ut-label:text-white ut-upload-icon:text-white ut-allowed-content:text-white"
          endpoint="media"
          onClientUploadComplete={(res: { url: SetStateAction<string>; }[]) => {
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

        <Button type='submit' className='dark:bg-primary-500 bg-lightmode-4'>
          Post Thread
        </Button>
      </form>
    </Form>
  );
}

export default PostThread;
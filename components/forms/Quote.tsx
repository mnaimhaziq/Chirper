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

interface Props {
    threadId: string;
    currentUserImg: string;
    currentUserId: string;
  }
const Quote = ({ threadId, currentUserImg, currentUserId }: Props) => {
    
    
        const pathname = usePathname();
      
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
            JSON.parse(currentUserId),
            pathname
          );
      
          if(quoteThread){
                toast.success("Quote sent successfully");
              form.reset();
          }
        };

  return (
    <Form {...form}>
    <form className='comment-form' onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
        name='thread'
        render={({ field }) => (
          <FormItem className='flex w-full items-center gap-3'>
            <FormLabel>
              <Image
                src={currentUserImg}
                alt='current_user'
                width={48}
                height={48}
                className='rounded-full object-cover'
              />
            </FormLabel>
            <FormControl className='border-none bg-transparent'>
              <Input
                type='text'
                {...field}
                placeholder='Quote...'
                className='no-focus dark:text-light-1 text-dark-1 outline-none'
              />
            </FormControl>
          </FormItem>
        )}
      />

      <Button type='submit' className='comment-form_btn'>
        Quote
      </Button>
    </form>
  </Form>
  )
}

export default Quote
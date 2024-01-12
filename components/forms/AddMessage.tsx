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
import Image from "next/image";

import { ThreadValidation } from "@/lib/validation/thread";
import { createThread } from "@/lib/actions/thread.action";
import { createMessage } from "@/lib/actions/message.action";

import io from 'socket.io-client';

const socket = io();

interface Props {
    senderId: string;
    recipientId: string;
}

function AddMessage({ senderId, recipientId }: Props) {
    const router = useRouter();
    const pathname = usePathname();

    const { organization } = useOrganization();

    const form = useForm<z.infer<typeof ThreadValidation>>({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: "",
            accountId: senderId,
        },
    });

    const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {

        await createMessage({
            senderId: senderId,
            recipientId: recipientId,
            text: values.thread,
            createdAt: new Date(),
            type: 'text',
        });

        socket.emit("sendMessage", values.thread);
        console.log(socket.id);
           
        form.reset()
    };

    return (
        <section className="absolute bottom-0 w-full mb-10 min-w-screen-md max-w-screen-lg mx-auto">
            <Form {...form}>
                <form
                    className='mt-10 flex flex-col justify-start gap-10'
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <div className="flex flex-row w-full">
                        <FormField
                            control={form.control}
                            name='thread'
                            render={({ field }) => (
                                <FormItem className='flex w-full'>
                                    <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                                        <input className="flex w-full rounded-md mr-5 px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <Button type='submit' className='bg-primary-500 rounded-full'>
                            <Image
                                src="/assets/send.svg"
                                alt="heart"
                                width={18}
                                height={18}
                                className="cursor-pointer object-contain"
                            />
                        </Button>
                    </div>
                </form>
            </Form>
        </section>
    );
}

export default AddMessage;
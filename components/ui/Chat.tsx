"use client";

// components/Chat.tsx
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { Message } from "../../lib/models/message.model";
import { createMessage, fetchAllMessages } from "@/lib/actions/message.action";
import { useForm } from "react-hook-form";
import { ThreadValidation } from "@/lib/validation/thread";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { currentUser } from "@clerk/nextjs";

interface ChatMessage {
    chatRoomId: string;
    senderId: string;
    recipientId: string;
    text: string;
    createdAt: Date;
    type: string
}


export default function Chat({ chatRoomId, ownerId, otherUserId }: any) {

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");

    var socket: any;
    socket = io("http://localhost:3001");

    function splitChatRoomId(chatRoomId: string) {
        // Split the chat room ID using the separator
        const userIds = chatRoomId.split("-");

        return userIds;
    }

    useEffect(() => {
        // // Fetch initial messages from the server
        // // fetch("/api/messages")
        // //     .then((res) => res.json())
        // //     .then((data) => setMessages(data.data));

        // // Listen for new messages from the socket server
        // socket.on("newMessage", (message: Message) => {
        //     setMessages((prevMessages) => [...prevMessages, message]);
        // });

        // return () => {
        //     socket.off("newMessage");
        // };

        fetchAllMessages(chatRoomId).then((data) => setMessages(data));

        socket.on("receive_msg", (message: ChatMessage) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

    }, [socket]);

    const handleSendMessage = async (values: z.infer<typeof ThreadValidation>) => {

        // Save the message to the server
        // fetch("/api/messages", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(newMessage),
        // });

        const newMessage: ChatMessage = {
            chatRoomId: chatRoomId,
            senderId: ownerId,
            recipientId: otherUserId,
            text: values.thread,
            createdAt: new Date(),
            type: 'text'
        };

        createMessage({
            chatId: chatRoomId,
            senderId: ownerId,
            recipientId: otherUserId,
            text: values.thread,
            createdAt: new Date(),
            type: 'text',
        });

        // Emit the new message to all connected clients
        await socket.emit("send_msg", newMessage);

        form.reset() // Clear the input field
    };

    const form = useForm<z.infer<typeof ThreadValidation>>({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: "",
            accountId: ownerId,
        },
    });

    function createChatRoomId(userId1: String, userId2: String) {

        const sortedUserIds = [userId1, userId2].sort();

        const chatRoomId = sortedUserIds.join("-");

        return chatRoomId;
    }

    return (
        <>
            <div className="relative w-full p-6 overflow-y-auto h-[35rem]">
                <div className="flex flex-col space-y-2 p-4">
                    {messages?.map((message) => (
                        message.senderId == ownerId ? <div className={'flex mb-4 justify-end'}>
                            <div className="rounded-lg p-3 max-w-xs bg-primary-500 text-white">
                                {message.text}
                            </div>
                        </div> : <div className={'flex mb-4 justify-start'}>
                            <div className="rounded-lg p-3 max-w-xs bg-dark-2 text-white">
                                {message.text}
                            </div>
                        </div>

                    ))}
                </div>
            </div>
            <div className="flex items-center p-4 w-full">
                <div className="bottom-0 mb-0 w-full">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSendMessage)}
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
                </div>
            </div>
        </>
    );
}

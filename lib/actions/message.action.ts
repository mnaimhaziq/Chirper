"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Thread from "../models/thread.model";
import Community from "../models/community.model";
import Message from "../models/message.model";

interface Params {
    chatId: string,
    senderId: string,
    recipientId: string,
    text: string,
    createdAt: Date,
    type: string,
}

export async function createMessage({ chatId, senderId, recipientId, text, createdAt, type }: Params) {
    try {
        connectToDB();

        const createdMessage = await Message.create({ chatId, senderId, recipientId, text, createdAt, type });
        console.log(createdMessage);
    } catch (error: any) {
        throw new Error(`Failed to create message: ${error.message}`);
    }
}

export async function fetchAllMessages(chatId: string): Promise<any[]> {
    connectToDB();

    const messages = await Message.find({ chatId: chatId }).sort({ createdAt: "asc"  });

    return messages;
}
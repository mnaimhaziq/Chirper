//senderId
//recipientId
//messageId
//content
//time
//type

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true
    },
    senderId: {
        type: String,
        required: true
    },
    recipientId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: true
    }
});

export default mongoose.models.Message || mongoose.model("Message", messageSchema);

export type Message = Document & {
    chatId: string;
    senderId: string;
    recipientId: string;
    text: string;
    createdAt: Date;
    type: string;
};
"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { io } from "socket.io-client"

import { Button } from "@/components/ui/button";
import { IconButton } from "@mui/material";


function UserChatCard({ ownerId, otherUserId, name, username, imgUrl, personType }: any) {
    const router = useRouter();
    const pathname = usePathname();

    let link = `/direct-message/${otherUserId}`;

    var socket: any;
    socket = io("http://localhost:3001");

    const handleJoin = () => {
        socket.emit("join_chat", createChatRoomId(ownerId, otherUserId));
        setTimeout(() => {}, 4000);
    };

    function createChatRoomId(userId1: String, userId2: String) {

        const sortedUserIds = [userId1, userId2].sort();

        const chatRoomId = sortedUserIds.join("-");

        return chatRoomId;
    }

    const isActive = (pathname.includes(link) && link.length > 1) || pathname === link;

    return (

        <article className='user-card' style={{ borderBottom: '1px solid #242323', paddingBottom: '20px' }}>
            <div className='user-card_avatar'>
                <div className='relative h-12 w-12'>
                    <Image
                        src={imgUrl}
                        alt='user_logo'
                        fill
                        className='rounded-full object-cover'
                    />
                </div>
                <div className='flex-1 text-ellipsis'>
                    <h4 className='text-base-semibold text-light-1'>{name}</h4>
                    <p className='text-small-medium text-gray-1'>@{username}</p>
                </div>
            </div>
            <Button
                className='user-card_btn'
                onClick={() => {
                    handleJoin();
                    router.push(`/direct-message/${otherUserId}`);
                }}
            >
                <Image
                    src="/assets/send.svg"
                    alt="heart"
                    width={18}
                    height={18}
                    className="cursor-pointer object-contain"
                />
                Message
            </Button>
        </article>


    );
}

export default UserChatCard;
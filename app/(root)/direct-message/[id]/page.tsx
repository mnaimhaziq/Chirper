import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { profileTabs } from "@/constants";
import { fetchUser } from "@/lib/actions/user.action";
import ProfileHeader from "@/components/shared/ProfileHeader";
import AddMessage from "@/components/forms/AddMessage";
import Message from "@/lib/models/message.model";
import { fetchAllMessages } from "@/lib/actions/message.action";

// import ThreadsTab from "@/components/shared/ThreadsTab";
// import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThreadsTab from "@/components/shared/ThreadsTab";

// import { fetchUser } from "@/lib/actions/user.actions";

//import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Chat from "@/components/ui/Chat";


async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(params.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  //const messages = await fetchAllMessages(user.id, userInfo.id);

  //const [messages, setMessagesState] = useState([]);

  // useEffect(() => {
  //   fetchMessages();

  //   socket.on('message', (message) => {
  //     setMessages((prevMessages) => [...prevMessages, message]);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  // const fetchMessages = async () => {
  //   const data = await Message.find().sort({ createdAt: 'asc' });
  //   setMessages(data);
  // };

  function createChatRoomId(userId1: String, userId2: String) {

    const sortedUserIds = [userId1, userId2].sort();

    const chatRoomId = sortedUserIds.join("-");

    return chatRoomId;
  }

  return (
    <div className="w-full">
      <div className="relative flex items-center p-3">
        <div className='flex w-full flex-col justify-start'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='relative h-20 w-20 object-cover'>
                <Image
                  src={userInfo.image}
                  alt='logo'
                  fill
                  className='rounded-full object-cover shadow-2xl'
                />
              </div>

              <div className='flex-1'>
                <h2 className='text-left text-heading3-bold text-light-1'>
                  {userInfo.name}
                </h2>
                <p className='text-base-medium text-gray-1'>@{userInfo.username}</p>
              </div>
            </div>
          </div>
          <div className='mt-12 h-0.5 w-full bg-dark-3' />
        </div>
      </div>
      <Chat chatRoomId={createChatRoomId(user.id, params.id)} ownerId={user.id} otherUserId={params.id} />
    </div>
  );
}
export default Page;
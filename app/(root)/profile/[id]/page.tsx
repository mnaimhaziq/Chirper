import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { profileTabs } from "@/constants";
import { fetchUser } from "@/lib/actions/user.action";
import { getUserReplies } from "@/lib/actions/user.action";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { getThreadsByUser } from "@/lib/actions/user.action";

import { useState } from 'react';

// import ThreadsTab from "@/components/shared/ThreadsTab";
// import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThreadsTab from "@/components/shared/ThreadsTab";
import RepliesTab from "@/components/shared/RepliesTab";

// import { fetchUser } from "@/lib/actions/user.actions";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(params.id);
  const userId = { userId: userInfo._id };
  const userReplies = await getUserReplies(userId.userId);
  const userThreads = await getThreadsByUser(userId.userId)

  // console.log('userInfo:', userInfo);

  if (!userInfo?.onboarded) redirect("/onboarding");

  // const showTabContent = (tabValue) => {
  //   const tabContents = document.querySelectorAll('.tab-content');
  //   tabContents.forEach((content) => {
  //     content.style.display = content.id === tabValue ? 'block' : 'none';
  //   });
  // };

  // const handleTabClick = (tabValue) => {
  //   showTabContent(tabValue);
  // };

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />

      <div className='mt-9'>
        <Tabs defaultValue='threads' className='w-full'>
          <TabsList className='tab'>
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className='object-contain'
                />
                <p className='max-sm:hidden'>{tab.label}</p>

                {tab.label === "Threads" && (
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {userThreads.length}
                  </p>
                )}
                {tab.label === "Replies" && (
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {userReplies.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList> 
          {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className='w-full text-light-1'
            >
              {/* @ts-ignore */}
              {tab.label === 'Threads' && (
                <ThreadsTab
                  currentUserId={user.id}
                  accountId={userInfo.id}
                  accountType='User'
                />
              )}
              {tab.label === 'Replies' && (
                <RepliesTab
                  currentUserId={user.id}
                  accountId={userInfo.id}
                  accountType='User'
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
export default Page;
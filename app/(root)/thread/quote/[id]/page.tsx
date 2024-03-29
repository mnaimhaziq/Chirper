import QuoteCard from '@/components/cards/QuoteCard';
import ThreadCard from '@/components/cards/ThreadCard';
import Quote from '@/components/forms/Quote';
import { fetchThreadById } from '@/lib/actions/thread.action';
import { fetchUser } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const thread = await fetchThreadById(params.id);

  return (
    <div>
              <Quote
          threadId={params.id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />

       <QuoteCard
          id={thread._id}
          currentUserId={user.id}
          parentId={thread.parentId}
          quoteId={thread.quoteId}
          content={thread.text}
          mediaLink={thread.mediaLink}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
    </div>
  )
}

export default page
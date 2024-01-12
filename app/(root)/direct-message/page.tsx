import React from 'react'
import { currentUser } from '@clerk/nextjs'
import { fetchUser, fetchUsers } from '@/lib/actions/user.action';
import { redirect } from 'next/navigation';
import UserChatCard from '@/components/cards/UserChatCard';

const page = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await currentUser();

  if (!user) return null;
  const userInfo = await fetchUser(user.id);

  const usersList = await fetchUsers({
    userId: user.id,
  });

  if (!userInfo?.onboarded) redirect('/onboarding');

  return (
    <main>
      <h1 className="head-text text-left">Direct Message</h1>
      <section className="mt-9 flex flex-col gap-10">
        {usersList.users.length > 0 ? (
          <>
            {usersList.users.map((person) => (
              <UserChatCard
                key={person.id}
                ownerId={user.id}
                otherUserId={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType='User'
              />
            ))}
          </>
        ) : (
          <p className='!text-base-regular text-light-3'>No users yet</p>
        )}

      </section>
    </main>
  )
}

export default page
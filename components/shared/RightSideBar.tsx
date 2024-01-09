import { currentUser } from "@clerk/nextjs";

import UserCard from "../cards/UserCard";

import { fetchCommunities } from "@/lib/actions/community.action";
import { fetchUser, fetchUsers } from "@/lib/actions/user.action";

async function RightSidebar() {
  const user = await currentUser();
  if (!user) return null;
  const similarMinds = await fetchUsers({
    userId: user.id,
    pageSize: 4,
  });

  const realUser = await fetchUser(user.id);
  var followings: any[] = [];
  for(var i=0; i<realUser.following.length; i++){
    followings.push(realUser.following.id);
  }

  const suggestedCOmmunities = await fetchCommunities({ pageSize: 4 });

  return (
    <section className='custom-scrollbar rightsidebar'>
      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-light-1'>
          Suggested Communities
        </h3>

        <div className='mt-7 flex w-[350px] flex-col gap-9'>
          {suggestedCOmmunities.communities.length > 0 ? (
            <>
              {suggestedCOmmunities.communities.map((community) => (
                <UserCard
                  key={community.id}
                  // following={followings}
                  currentUser={user.id}
                  id={community.id}
                  name={community.name}
                  username={community.username}
                  imgUrl={community.image}
                  personType='Community'
                />
              ))}
            </>
          ) : (
            <p className='!text-base-regular text-light-3'>
              No communities yet
            </p>
          )}
        </div>
      </div>

      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-light-1'>Similar Minds</h3>
        <div className='mt-7 flex w-[350px] flex-col gap-10'>
          {similarMinds.users.length > 0 ? (
            <>
              {similarMinds.users.map((person) => (
                <UserCard
                  key={person.id}
                  // following={followings}
                  currentUser={user.id}
                  id={person.id}
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
        </div>
      </div>
    </section>
  );
}

export default RightSidebar;
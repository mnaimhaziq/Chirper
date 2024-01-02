import { redirect } from "next/navigation";
import ThreadTabCard from "../cards/ThreadTabCard";
import { fetchUserPosts } from "@/lib/actions/user.action";
import { fetchCommunityPosts } from "@/lib/actions/community.action";
import { getThreadsByUser } from "@/lib/actions/user.action";
import { fetchUser } from "@/lib/actions/user.action";
import { fetchThreadById } from "@/lib/actions/thread.action";

interface Result {
  name: string;
  image: string;
  id: string;
  threads: {
    _id: string;
    text: string;
    parentId: string | null;
    author: {
      name: string;
      image: string;
      id: string;
    };
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    children: {
      author: {
        image: string;
      };
    }[];
  }[];
}

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

async function ThreadsTab({ currentUserId, accountId, accountType }: Props) {
  let result: Result;

  if (accountType === "Community") {
    result = await fetchCommunityPosts(accountId);
  } else {
    result = await fetchUserPosts(accountId);
  }

  if (!result) {
    redirect("/");
  }

  // console.log(result)

  const userInfo = await fetchUser(accountId);
  const userId = { userId: userInfo._id };

  const userThreads = await getThreadsByUser(userId.userId)

  // Fetch additional information for each thread
const threadDetailsPromises = userThreads.map(async (reply) => {
  const threadDetails = await fetchThreadById(reply._id);
  return threadDetails;
});

// Wait for all the promises to resolve
const threadDetails = await Promise.all(threadDetailsPromises);
  // console.log(threadDetails)

  return (
    <section className='mt-9 flex flex-col gap-10'>
      {threadDetails.map((thread) => (
        <ThreadTabCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === "User"
              ? { name: thread.author.name, image: thread.author.image, id: thread.author.id }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          community={
            accountType === "Community"
              ? { name: result.name, id: result.id, image: result.image }
              : thread.community
          }
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      ))}
    </section>
  );
}

export default ThreadsTab;
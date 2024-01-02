import { redirect } from "next/navigation";
import RepliedCard from "../cards/RepliedCard";
import { fetchUserPosts, getActivity, getUserReplies } from "@/lib/actions/user.action";
import { fetchCommunityPosts } from "@/lib/actions/community.action";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.action";
import { fetchThreadById } from "@/lib/actions/thread.action";

interface Reply {
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
  children?: {
    author: {
      image: string;
    };
  }[];
}

interface UserRepliesResult {
  name: string;
  image: string;
  id: string;
  replies: Reply[];
}

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

async function RepliesTab({ currentUserId, accountId, accountType }: Props) {
  // const user = await currentUser();
  // if (!user) return null;

  const userInfo = await fetchUser(accountId);
  const userId = { userId: userInfo._id };

  const userReplies = await getUserReplies(userId.userId);

// Fetch additional information for each thread
const threadDetailsPromises = userReplies.map(async (reply) => {
  const threadDetails = await fetchThreadById(reply._id);
  return threadDetails;
});

// Wait for all the promises to resolve
const threadDetails = await Promise.all(threadDetailsPromises);

// console.log(threadDetails);

// console.log(userReplies)

  if (!userReplies) {
    redirect("/");
  }

  return (
    <section className='mt-9 flex flex-col gap-10'>
      {threadDetails.map((reply) => (
        <RepliedCard
          key={reply._id}
          id={reply._id}
          currentUserId={reply._id}
          parentId={reply.parentId}
          content={reply.text}
          author={
            accountType === "User"
              ? { name: reply.author.name, image: reply.author.image, id: reply.author.id }
              : {
                  name: reply.author.name,
                  image: reply.author.image,
                  id: reply.author.id,
                }
          }
          community={
            accountType === "Community"
              ? { name: userInfo.name, id: userInfo.id, image: userInfo.image }
              : null
          }
          createdAt={reply.createdAt}
          comments={reply.children}
          // additionalInfo={threadDetails[index]}
        />
      ))}
    </section>
    // <p>Hello</p>
  );
}

export default RepliesTab;
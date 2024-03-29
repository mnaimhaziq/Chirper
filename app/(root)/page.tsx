

import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.action";
import { UserButton, currentUser } from "@clerk/nextjs";
import ToggleButtons from "@/components/ui/ToggleButtons";
export default async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const result = await fetchPosts(1, 30);

  return (
    <>
       <ToggleButtons />
      <h1 className="head-text text-left dark:text-light-1 text-dark-1">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No Threads Found</p>
        ) : (
          <>
            {result.posts.map((post : any) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user.id}
                parentId={post.parentId}
                mediaLink={post.mediaLink}
                quoteId={post.quoteId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}

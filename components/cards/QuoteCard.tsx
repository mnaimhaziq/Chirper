
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import VisibilityIcon from '@mui/icons-material/Visibility';

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  quoteId: string | null;
  content: string;
  mediaLink: string;
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
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}

const QuoteCard = ({
  id,
  currentUserId,
  parentId,
  quoteId,
  content,
  mediaLink,
  author,
  community,
  createdAt,
  comments,
  isComment,
}: Props) => {

const getMediaType = (url?: string) => {
  const extension = url?.split(".").pop()?.toLowerCase();

  if (extension === "mp4" || extension === "webm") {
    return "video";
  }

  return "image";
};

  const mediaType = getMediaType(mediaLink);
  return (
    <article
      className={`flex w-full flex-col rounded-xl dark:bg-slate-800 bg-lightmode-3 mt-4 ${isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7 py-5"
        }`}
    >
      <div className='flex items-start justify-between' >
        <div className='flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            <Link href={`/profile/${author.id}`} className='relative h-11 w-11'>
              <Image
                src={author.image}
                alt='user_community_image'
                fill
                className='cursor-pointer rounded-full'
              />
            </Link>

            <div className='thread-card_bar' />
          </div>

          <div className='flex w-full flex-col'>
            <div className="flex justify-between">
              <Link href={`/profile/${author.id}`} className='w-fit'>
                <h4 className='cursor-pointer text-base-semibold text-light-1'>
                  {author.name}
                </h4>
              </Link>
              <Link href={`/thread/${quoteId}`}>
                <VisibilityIcon sx={{ color: "#FFFFFF" }} />
              </Link>
            </div>

            <p className='mt-2 text-small-regular dark:text-light-2 text-light-1'>{content}</p>

            {mediaLink !== null && mediaLink !== "" && mediaLink ? (
              mediaType === "image" ? (
                <img
                  className="mt-4"
                  src={mediaLink}
                  alt="threadImage"
                  width={400}
                  height={200}
                />
              ) : mediaType === "video" ? (
                <video className="mt-4" width={400} height={200} controls>
                  <source src={mediaLink} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : null
            ) : null}
          </div>
        </div>
      </div>


    </article>
  )
}

export default QuoteCard
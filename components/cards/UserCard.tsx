"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"; 
import { Button } from "../ui/button";
import { fetchFollowing, fetchUser, updateFollowing } from "@/lib/actions/user.action";
import User from "@/lib/models/user.model";

interface Props {
  currentUser: string;
  _id: string;
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  personType: string;
}

function UserCard({currentUser, _id, id, name, username, imgUrl, personType}: Props) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const renderThis = async () => {
      const realUser = await fetchUser(currentUser);
    
    if(realUser.following.includes(_id)){
      setIsFollowing(true);
    }
    }
    renderThis();
  }, []);

  // const renderThis = async () => {
  //   const realUser = await fetchUser(currentUser);
  //   console.log("Following :"+ realUser.following)
  
  // if(realUser.following.map((item : any) => item.id).includes(id)){
  //   setIsFollowing(true);
  // }
  // }

  
  // const realUser = await fetchUser(currentUser);

  // if(realUser.following.includes(id)){
  //   setIsFollowing(true);
  // }
  // if(following.includes(id)){
  //   setIsFollowing(true);
  // }

  const isCommunity = personType === "Community";

  const handleFollowClick = () => {
    // Assuming you have an updateFollowing function to handle follow logic
    // Update the follow status in the UI (optimistically)
    
     updateFollowing(currentUser, id);
     setIsFollowing(!isFollowing);
  };

  return (
    <article className='user-card'>
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
        onClick={() => handleFollowClick()}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
    </article>
  );
}

export default UserCard;
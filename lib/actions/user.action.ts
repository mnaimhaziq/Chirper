"use server";

import mongoose, { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";

import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";

import { connectToDB } from "../mongoose";
import mongoose from "mongoose";


export async function fetchUser(userId: string) {
  try {
    connectToDB();

    const result = await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
    });

    return JSON.parse(JSON.stringify(result)); 
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchFollowing(userId: string) {
  try{
    connectToDB();
    return await User.findOne({id: userId}).populate({
      path: "following",
      model: User,
    })
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // Find all threads authored by the user with the given userId
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
        },
      ],
    });
    return threads;
  } catch (error) {
    console.error("Error fetching user threads:", error);
    throw error;
  }
}

// Almost similar to Thead (search + pagination) and Community (search + pagination)
export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the results.
    };

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    // Find all threads created by the user
    const userThreads = await Thread.find({ author: userId });

    // Collect all the child thread ids (replies) from the 'children' field of each user thread
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    // Find and return the child threads (replies) excluding the ones created by the same user
    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId }, // Exclude threads authored by the same user
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error) {
    console.error("Error fetching replies: ", error);
    throw error;
  }
}

export async function updateFollowing(currentUser: string, targetUser: string) {
  try {
    connectToDB();
    // Find the target user
    const targetUserData = await User.findOne({ id: targetUser });

    // Check if the currentUser is already following the targetUser
    if (!targetUserData) {
      throw new Error(`Target user with ID ${targetUser} not found.`);
    }

    // Check if the currentUser is already following the targetUser
    if (targetUserData.followers && targetUserData.followers.includes(currentUser)) {
      console.log(`User ${currentUser} is already following ${targetUser}.`);
      return; // Do nothing if already following
    }
    const currentUserObject = await fetchUser(currentUser);

    try {
      await User.findOneAndUpdate(
        { id: targetUser },
        {
          $push: { followers: currentUserObject } 
        },
        { upsert: true }
      );
    } catch (error) {
      console.log("error : " + error)
    }

    const targetUserObject = await fetchUser(targetUser);

    await User.findOneAndUpdate(
      { id: currentUser },
      {
        $push: { following: targetUserObject }  
      },
      { upsert: true }
    );

    console.log(`User ${currentUser} is now following ${targetUser}.`);

  } catch (error) {
    console.error("Error updating following: ", error);
    throw error;
  }
}

export async function getUserReplies(userId: mongoose.Schema.Types.ObjectId) {
  try {
    connectToDB();

    // Find both parent threads and their replies authored by the user with the given userId
    const replies = await Thread.find({
      $or: [
        // { author: userId, parentId: null }, // Parent threads
        { author: userId, parentId: { $ne: null } }, // Replies
      ],
    });

    // Extract unique parentIds from the replies
    const parentIds = [...new Set(replies.map(reply => reply.parentId))];

    // Convert parentIds to ObjectId type
    const parentObjectIds = parentIds.map(parentId => new mongoose.Types.ObjectId(parentId));

    // Fetch original threads based on the converted ObjectIds
    const originalThreads = await Thread.find({ _id: { $in: parentObjectIds } });

    // console.log(originalThreads);

    return originalThreads;
  } catch (error) {
    console.error("Error fetching user replies:", error);
    throw error;
  }
}


export async function removeFollowing(currentUser: string, targetUser: string) {
  try {
    connectToDB(); // Assuming connectToDB is correctly implemented in your code

    // Remove the currentUser from the followers of targetUser
    await User.updateOne(
      { _id: targetUser },
      {
        $pull: { followers: currentUser }
      }
    );

    // Remove the targetUser from the following of currentUser
    await User.updateOne(
      { id: currentUser },
      {
        $pull: { following: targetUser }
      }
    );

    console.log(`User ${currentUser} is no longer following ${targetUser}.`);

  } catch (error) {
    console.error("Error removing following: ", error);
    throw error;
  }
}

    
export async function getThreadsByUser(userId: mongoose.Schema.Types.ObjectId) {
  try {
    connectToDB();

    // Find both parent thread and its replies authored by the user with the given userId
    const threads = await Thread.find({
      $or: [
        { author: userId, parentId: null }, // Original threads
        // { author: userId, parentId: { $ne: null } }, // Replies
      ],
    });

    return threads;
  } catch (error) {
    console.error("Error fetching user replies:", error);
    throw error;
  }
}
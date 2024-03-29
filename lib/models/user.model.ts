import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: String,
  bio: String,
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  // replies: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Replies",
  //   },
  // ],
  // likes: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Likes",
  //   },
  // ],
  onboarded: {
    type: Boolean,
    default: false,
  },
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  follower: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
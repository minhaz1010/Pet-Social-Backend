import { model, Schema } from "mongoose";
import { IPost } from "./post.interface";

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
    },
    petType: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },

    isPremium: {
      type: Boolean,
      default: false,
    },
    postType: {
      type: String,
      enum: ["STORY", "TIP"],
      default: "STORY",
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    image: [
      {
        public_id: { type: String },
        secure_url: { type: String },
      },
    ],
    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Post = model<IPost>("Post", postSchema);

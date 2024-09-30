import { model, Schema } from "mongoose";
import { IPost } from "./post.interface";

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
    },
    petType:{
     type:String,
     required:true
    },
    content: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
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
      ref: "USER",
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const Post = model<IPost>("Post", postSchema);

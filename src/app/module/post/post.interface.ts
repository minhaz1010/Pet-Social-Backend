import { Schema } from "mongoose";
export type TPostType = "TIP" | "STORY";

export interface IPost {
  title: string;
  content: string;
  petType:string;
  imageURL?: string;
  postType: TPostType;
  author: Schema.Types.ObjectId;
  isPremium: boolean;
  likes: number;
  dislikes: number;
}

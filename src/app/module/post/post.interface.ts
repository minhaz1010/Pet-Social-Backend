import {  Types } from "mongoose";
export type TPostType = "TIP" | "STORY";

export interface IPost {
  title: string;
  content: string;
  petType: string;
  imageURL?: string;
  postType: TPostType;
  author: Types.ObjectId;
  isPremium: boolean;
  likes: number;
  dislikes: number;
}

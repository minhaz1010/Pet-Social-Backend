import { Types } from "mongoose";
export type TPostType = "TIP" | "STORY";

export interface IPost {
  title: string;
  content: string;
  petType: string;
  image?: [
    {
      public_id: string;
      secure_url: string;
    },
  ];
  postType: TPostType;
  author: Types.ObjectId;
  isPremium: boolean;
  likes: number;
  dislikes: number;
  likedBy: Types.ObjectId[];
  dislikedBy: Types.ObjectId[];
}

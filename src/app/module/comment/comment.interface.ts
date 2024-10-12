import { Types } from "mongoose";

export interface IComment {
  content: string;
  author: Types.ObjectId;
  post: Types.ObjectId;
  likes: number;
  likedBy: Types.ObjectId[];
  dislikedBy: Types.ObjectId[];
  dislikes: number;
}

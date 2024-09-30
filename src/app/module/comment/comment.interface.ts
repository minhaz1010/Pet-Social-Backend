import { Schema } from "mongoose";

export interface IComment {
  content: string;
  author: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
  likes: number;
  dislikes: number;
}

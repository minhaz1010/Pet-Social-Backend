import { Schema } from "mongoose";

export type TRole = "user" | "admin";

export type TMemberShip = "regular" | "premium";

export interface IUser {
  userId: string;
  userName:string;
  fullName:string;
  email: string;
  imageURL?: string;
  role: TRole;
  membership: TMemberShip;
  posts: Schema.Types.ObjectId[];
  follower: Schema.Types.ObjectId[];
  following: Schema.Types.ObjectId[];
}

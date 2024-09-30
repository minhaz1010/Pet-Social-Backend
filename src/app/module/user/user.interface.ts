import { Schema } from "mongoose";

export type TRole = "USER" | "ADMIN";

export type TMemberShip = "REGULAR" | "PREMIUM";

export interface IUser {
  userId: string;
  userName: string;
  fullName: string;
  email: string;
  imageURL?: string;
  phone?:string;
  address:string;
  role: TRole;
  membership: TMemberShip;
  posts?: Schema.Types.ObjectId[];
  followers?: Schema.Types.ObjectId[];
  followings?: Schema.Types.ObjectId[];
}

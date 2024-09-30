import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";

const userSchema = new Schema<IUser>({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  imageURL: {
    type: String,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "POST",
    },
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "USER",
    },
  ],
  followings: [
    {
      type: Schema.Types.ObjectId,
      ref: "USER",
    },
  ],
  membership: {
    type: String,
    enum: ["REGULAR", "PREMIUM"],
    default: "REGULAR",
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
},{
  timestamps:true
});

export const User = model<IUser>("USER", userSchema);

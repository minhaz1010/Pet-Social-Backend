import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";

const userSchema = new Schema<IUser>({
  userId:{
    type:String,
    required:true,
  },
  userName:{
    type:String,
    required:true
  },
  fullName:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  imageURL:{
    type:String,
  },
  posts:[{
    type:Schema.Types.ObjectId,
    ref:"POST"
  }],
  follower:[
    {
      type:Schema.Types.ObjectId,
      ref:"USER"
    }
  ],
  following:[
    {
      type:Schema.Types.ObjectId,
      ref:"USER"
    }
  ],
  membership:{
    type:String,
    default:"regular"
  },
  role:{
    type:String,
    default:"user"
  }

})

export const User = model<IUser>("USER",userSchema);


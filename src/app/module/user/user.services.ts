import { clerkClient, UserJSON } from "@clerk/clerk-sdk-node";
import { User } from "./user.model";
import AppError from "../../errors/appError";
import httpStatus from "http-status";
import mongoose from "mongoose";
// NOTE: create user in Clerk and then save in our own database
const createUserInDatabaseFromClerk = async (payload: UserJSON) => {
  if (payload) {
    const userId = payload.id;
    const userName = (payload.username as string) || "haha";
    const fullName = `${(payload.first_name as string) || "srk"} ${(payload.last_name as string) || "salman"}`;
    const email = payload.email_addresses[0].email_address;
    const imageURL = payload.image_url;
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { role: "USER" },
    });
    const user = {
      userId,
      userName,
      fullName,
      email,
      imageURL,
    };
    await User.create(user);
  }
};
// NOTE: update user in clerk and then save in our own database
const updateUserInDatabaseFromClerk = async (payload: UserJSON) => {
  if (payload) {
    const userId = payload.id;
    const userName = payload.username as string;
    const fullName = `${payload.first_name as string} ${payload.last_name as string}`;
    const email = payload.email_addresses[0].email_address;
    const imageURL = payload.image_url;
    const user = {
      userId,
      userName,
      fullName,
      email,
      imageURL,
    };
    await User.findOneAndUpdate({ userId }, user, { new: true });
  }
};
// NOTE:  delete user in clerk and then save in out own database
const deleteUserInDatabaseFromClerk = async (payload: UserJSON) => {
  if (payload) {
    const userId = payload.id;
    await User.findOneAndDelete({ userId });
  }
};
// NOTE: get all users from our own database
const getAllUserFromDatabase = async () => {
  const result = await User.find();
  return result;
};

// NOTE: a user details(fe e hit korle okhan theke clerk er maddhome req.auth.userId hote information pabo then get korbo ekhon manually kortesi)

const getAUserDetails = async (userId: string) => {
  const result = await User.findOne({ userId })
    .populate({
      path: "followers",
      select: "userName email imageURL",
    })
    .populate({
      path: "followings",
      select: "userName email imageURL",
    })
    .populate({
      path: "posts",
    });
  return result;
};

// NOTE: follow a user/author by followerId(whom to follow)
const followUser = async (followerId: string, followedUserId: string) => {
  // ^ jake follow korbo take khujlam
  const followerUser = await User.findById(followerId);
  // ^ naa paile bolbo paai naai
  if (!followerUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "Follower user not found");
  }
  //  ^ je user follow korbe taake khujlam
  const followedUser = await User.findOne({ userId: followedUserId });
  // ^ naa paile bolbo paai naai
  if (!followedUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User to be followed not found");
  }

  const followedUser_id = followedUser._id;
  //  ^ je user follow korbe sei user er id ke object id te rupantor korlam
  const followedUserObjectId = new mongoose.Types.ObjectId(followedUser_id);

  //  ^ check kortesi je user ki aage theke follower ke follow kore kina
  const isAlreadyFollowing = followerUser.followers?.includes(
    followedUserObjectId,
  ) as boolean;
  //  ^ jodi user aage theke follow kore tahole ei message dibo
  if (isAlreadyFollowing) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are already following this user",
    );
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // jare follow korbo taar followers e je user follow korbe tar id dhukaiya dilam
    const updatedFollower = await User.findByIdAndUpdate(
      followerId,
      { $push: { followers: followedUserObjectId } },
      { new: true, session },
    );

    if (!updatedFollower) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Failed to update follower's following list",
      );
    }
    //  ^ je user follow korbe taar followers e followerId dhukaiya dilam
    const updatedFollowedUser = await User.findByIdAndUpdate(
      followedUserObjectId,
      { $push: { followings: followerId } },
      { new: true, session },
    );

    if (!updatedFollowedUser) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Failed to update user's followers list",
      );
    }

    await session.commitTransaction();
    return {
      updatedFollower,
      updatedFollowedUser,
    };
  } catch (error) {
    await session.abortTransaction();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Transaction failed: Unable to follow/unfollow user",
    );
  } finally {
    session.endSession();
  }
};

// NOTE: unfollow a user/author by followerId(whom to unfollow)
const unfollowUser = async (followerId: string, followedUserId: string) => {
  // followerId ==> minhaz1111
  // followedUserId ==> minhaz1010
  // ^ check kortesi jare unfollow korbo se ache kina
  const followerUser = await User.findById(followerId);
  if (!followerUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "Follower user not found");
  }
  // ^ check kortesi je user unfollow korbe se ache kina
  const followedUser = await User.findOne({ userId: followedUserId });
  if (!followedUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User to be followed not found");
  }
  const followerUser_id = followedUser._id;

  const followedUserObjectId = new mongoose.Types.ObjectId(followerUser_id);

  //  check kortesi je user follow korbe sei follower er followings e userId ache kina
  const isAlreadyFollowing = followerUser.followers?.includes(
    followedUserObjectId,
  ) as boolean;
  //  jodi userId naa thake taar mane se already taake unfollow kore
  if (!isAlreadyFollowing) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already unfollowed this user",
    );
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    //  jaake unfollow korbo taar followers theke userId remove korlam
    const updatedFollower = await User.findByIdAndUpdate(
      followerId,
      { $pull: { followers: followedUserObjectId } },
      { new: true, session },
    );

    if (!updatedFollower) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Failed to update follower's following list",
      );
    }

    // je unfollow korbe taar followings theke follwerId remove korlam hehe
    const updatedFollowedUser = await User.findByIdAndUpdate(
      followedUserObjectId,
      { $pull: { followings: followerId } },
      { new: true, session },
    );

    if (!updatedFollowedUser) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Failed to update user's followers list",
      );
    }

    await session.commitTransaction();
    return {
      updatedFollower,
      updatedFollowedUser,
    };
  } catch (error) {
    await session.abortTransaction();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Transaction failed: Unable to follow/unfollow user",
    );
  } finally {
    session.endSession();
  }
};

const getAUserDetailsByUserName = async (userName: string) => {
  const result = await User.findOne({ userName })
    .populate({
      path: "followers",
      select: "userName email imageURL userId",
    })
    .populate({
      path: "followings",
      select: "userName email imageURL userId",
    })
    .populate({
      path: "posts",
      populate: {
        path: "author",
        select: "userName email imageURL",
      },
    });
  return result;
};

export const UserServices = {
  createUserInDatabaseFromClerk,
  updateUserInDatabaseFromClerk,
  deleteUserInDatabaseFromClerk,
  getAllUserFromDatabase,
  getAUserDetails,
  followUser,
  unfollowUser,
  getAUserDetailsByUserName,
};

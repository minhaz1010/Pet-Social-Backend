import httpStatus from "http-status";
import AppError from "../../errors/appError";
import { IPost } from "./post.interface";
import { Post } from "./post.model";
import { User } from "../user/user.model";
import mongoose from "mongoose";

// NOTE: create post in database
const createPostInDatabase = async (payload: Partial<IPost>) => {
  const user = await User.findOne({ userId: payload.author });
  const post = {
    ...payload,
    author: user?._id,
    image: payload.image,
  };
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const postData = await Post.create([post], { session });
    if (postData.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, "Could Not Create Post");
    }
    const updatedUser = await User.findByIdAndUpdate(
      user?._id,
      {
        $push: { posts: postData[0]._id },
      },
      {
        new: true,
        session,
      },
    );
    if (!updatedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Could Not Update User");
    }
    await session.commitTransaction();
    return postData;
  } catch (error) {
    await session.abortTransaction();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Could Not Create Post and update the user",
    );
  } finally {
    session.endSession();
  }
};

// NOTE: get all posts from database
const getAllPostInDatabase = async (
  page: number,
  limit: number,
  category?: string,
) => {
  let query = Post.find();

  if (category) {
    query = query.where("postType").equals(category);
  }

  const result = await query
    .skip((page - 1) * limit)
    .limit(limit)
    .populate({
      path: "author",
      select: "userName imageURL userId followers followings",
    })
    .sort("-createdAt");

  const totalPosts = await Post.countDocuments(
    category ? { postType: category } : {},
  );

  if (result.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Sorry, No Posts Found");
  }

  return {
    result,
    totalPosts,
  };
};

// NOTE: get single post from database by postId
const getSinglePostFromDatabase = async (postId: string) => {
  const result = await Post.findById(postId).populate("author");
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "Sorry, No Post Found");
  }
  return result;
};
// NOTE: update a single post by postId
const updateSinglePostFromDatabase = async (
  postId: string,
  payload: Partial<IPost>,
) => {
  const postExist = await Post.findById(postId);
  if (!postExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Post Found For Update");
  }
  const result = await Post.findByIdAndUpdate(postId, payload, { new: true });
  return result;
};

// NOTE: delete single post by postId
const deleteSinglePostFromDatabase = async (postId: string) => {
  const postExist = await Post.findById(postId);
  if (!postExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Post Found For Delete");
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const postData = await Post.findByIdAndDelete(postId, {
      session,
      new: true,
    });
    if (!postData) {
      throw new AppError(httpStatus.BAD_REQUEST, "Could not delete the post");
    }
    const updateUser = await User.findByIdAndUpdate(
      postExist.author,
      {
        $pull: { posts: postId },
      },
      {
        new: true,
        session,
      },
    );
    if (!updateUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Could not update the user");
    }
    await session.commitTransaction();
    return null;
  } catch (error) {
    await session.abortTransaction();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Could Not delete the post and update the user",
    );
  } finally {
    await session.endSession();
  }
};
// NOTE: update a post free to premium by postId
const updateAPostPremiumInDatabase = async (postId: string) => {
  const postExist = await Post.findById(postId);
  if (!postExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Post Found For Update");
  }
  const result = await Post.findByIdAndUpdate(
    postId,
    { isPremium: true },
    { new: true },
  );
  return result;
};

// likes and dislikes

const likeAPost = async (postId: string, userId: string) => {
  const userData = await User.findOne({ userId });
  const postData = await Post.findById(postId);
  const userObjectId = new mongoose.Types.ObjectId(userData?._id);
  if (!postData) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Post Found");
  }
  if (postData.dislikedBy.includes(userObjectId)) {
    postData.dislikedBy = postData.dislikedBy.filter(
      (id) => id === userObjectId,
    );
    postData.dislikes -= 1;
  }
  if (postData.likedBy.includes(userObjectId)) {
    postData.likedBy = postData.likedBy.filter((id) => id === userObjectId);
    if (postData.likes > 0) {
      postData.likes -= 1;
    }
  } else {
    postData.likedBy.push(userObjectId);
    postData.likes += 1;
  }
  const result = await postData.save();
  return result;
};

const disLikeAPost = async (postId: string, userId: string) => {
  const userData = await User.findOne({ userId });
  const postData = await Post.findById(postId);
  const userObjectId = new mongoose.Types.ObjectId(userData?._id);
  if (!postData) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Post Found");
  }
  if (postData.likedBy.includes(userObjectId)) {
    postData.likedBy = postData.likedBy.filter((id) => id === userObjectId);
    postData.likes -= 1;
  }
  if (postData?.dislikedBy.includes(userObjectId)) {
    postData.dislikedBy = postData.dislikedBy.filter(
      (id) => id === userObjectId,
    );
    if (postData.dislikedBy) {
      postData.dislikes -= 1;
    }
  } else {
    postData.dislikedBy.push(userObjectId);
    postData.dislikes += 1;
  }

  const result = await postData.save();
  return result;
};

export const PostServices = {
  createPostInDatabase,
  getAllPostInDatabase,
  getSinglePostFromDatabase,
  deleteSinglePostFromDatabase,
  updateSinglePostFromDatabase,
  updateAPostPremiumInDatabase,
  likeAPost,
  disLikeAPost,
};

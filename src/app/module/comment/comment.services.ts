import httpStatus from "http-status";
import AppError from "../../errors/appError";
import { Post } from "../post/post.model";
import { IComment } from "./comment.interface";
import { Comment } from "./comment.model";
import { User } from "../user/user.model";
import mongoose from "mongoose";
// NOTE: post a comment in a  post
const postAComment = async (postId: string, payload: Partial<IComment>) => {
  const postExist = await Post.findById(postId);
  if (!postExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Post Found ");
  }
  const userData = await User.findOne({ userId: payload.author });
  const updatePayload = {
    ...payload,
    post: postId,
    author: userData?._id,
  };
  const result = await Comment.create(updatePayload);
  return result;
};

// NOTE: get all comments of a post by postId
const getAllCommentsOfAPost = async (postId: string) => {
  const postExist = await Post.findById(postId);
  if (!postExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Post Found ");
  }
  const result = await Comment.find({ post: postId }).sort("-createdAt").populate({
    path:"author",
    select:"userName imageURL"
  });
  if (result.length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Sorry No Comments Found For This Post",
    );
  }
  return result;
};

// NOTE: delete a single comment of a post by commentId
const deleteASingleCommentsOfAPost = async (commentId: string) => {
  const commentExist = await Comment.findById(commentId);
  if (!commentExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Comment Found");
  }
  await Comment.findByIdAndDelete(commentId);
  return null;
};
// NOTE: update a single comment of a post by commentId
const updateASingleCommentOfAPost = async (
  commentId: string,
  payload: Partial<IComment>,
) => {
  const commentExist = await Comment.findById(commentId);
  if (!commentExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Comment Found");
  }

  const result = await Comment.findByIdAndUpdate(commentId, payload, {
    new: true,
  });
  return result;
};

const likeAComment = async (commentId: string, userId: string) => {
  const userData = await User.findOne({ userId });
  const commentData = await Comment.findById(commentId);
  const userObjectId = new mongoose.Types.ObjectId(userData?._id);
  if (!commentData) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Comment Found");
  }
  if (commentData.dislikedBy.includes(userObjectId)) {
    commentData.dislikedBy = commentData.dislikedBy.filter(
      (id) => id === userObjectId,
    );
    commentData.dislikes -= 1;
  }
  if (commentData.likedBy.includes(userObjectId)) {
    commentData.likedBy = commentData.likedBy.filter(
      (id) => id === userObjectId,
    );
    if (commentData.likes > 0) {
      commentData.likes -= 1;
    }
  } else {
    commentData.likedBy.push(userObjectId);
    commentData.likes += 1;
  }
  const result = await commentData.save();
  return result;
};

const disLikeAComment = async (commentId: string, userId: string) => {
  const userData = await User.findOne({ userId });
  const commentData = await Comment.findById(commentId);
  const userObjectId = new mongoose.Types.ObjectId(userData?._id);
  if (!commentData) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Comment Found");
  }
  if (commentData.likedBy.includes(userObjectId)) {
    commentData.likedBy = commentData.likedBy.filter(
      (id) => id === userObjectId,
    );
    commentData.likes -= 1;
  }
  if (commentData?.dislikedBy.includes(userObjectId)) {
    commentData.dislikedBy = commentData.dislikedBy.filter(
      (id) => id === userObjectId,
    );
    if (commentData.dislikedBy) {
      commentData.dislikes -= 1;
    }
  } else {
    commentData.dislikedBy.push(userObjectId);
    commentData.dislikes += 1;
  }

  const result = await commentData.save();
  return result;
};

export const CommentServices = {
  postAComment,
  getAllCommentsOfAPost,
  deleteASingleCommentsOfAPost,
  updateASingleCommentOfAPost,
  likeAComment,
  disLikeAComment,
};

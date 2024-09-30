import httpStatus from "http-status";
import AppError from "../../errors/appError";
import { Post } from "../post/post.model";
import { IComment } from "./comment.interface";
import { Comment } from "./comment.model";
// NOTE: post a comment in a  post
const postAComment = async (postId: string, payload: Partial<IComment>) => {
  const postExist = await Post.findById(postId);
  if (!postExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Post Found ");
  }
  const result = await Comment.create(payload);
  return result;
};

// NOTE: get all comments of a post by postId
const getAllCommentsOfAPost = async (postId: string) => {
  const postExist = await Post.findById(postId);
  if (!postExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Post Found ");
  }
  const result = await Comment.find({ post: postId });
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

export const CommentServices = {
  postAComment,
  getAllCommentsOfAPost,
  deleteASingleCommentsOfAPost,
  updateASingleCommentOfAPost,
};

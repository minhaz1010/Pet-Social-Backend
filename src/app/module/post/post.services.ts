import httpStatus from "http-status";
import AppError from "../../errors/appError";
import { IPost } from "./post.interface";
import { Post } from "./post.model";

const createPostInDatabase = async (
  payload: Partial<IPost>,
  imageUrl: string,
) => {
  const post = {
    ...payload,
    imageURL: imageUrl,
  };

  const result = await Post.create(post);
  return result;
};

const getAllPostInDatabase = async () => {
  const result = await Post.find();
  if (result.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Sorry, No Posts Found");
  }
  return result;
};

const getSinglePostFromDatabase = async (id: string) => {
  const result = await Post.findById(id);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "Sorry, No Post Found");
  }
  return result;
};

const updateSinglePostFromDatabase = async (
  id: string,
  payload: Partial<IPost>,
) => {
  const postExist = await Post.findById(id);
  if (!postExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Post Found For Update");
  }
  const result = await Post.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteSinglePostFromDatabase = async (id: string) => {
  const postExist = await Post.findById(id);
  if (!postExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Post Found For Delete");
  }
  await Post.findByIdAndDelete(id);
  return null;
};

const updateAPostPremiumInDatabase = async (id: string) => {
  const postExist = await Post.findById(id);
  if (!postExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Post Found For Update");
  }
  const result = await Post.findByIdAndUpdate(
    id,
    { isPremium: true },
    { new: true },
  );
  return result;
};

export const PostServices = {
  createPostInDatabase,
  getAllPostInDatabase,
  getSinglePostFromDatabase,
  deleteSinglePostFromDatabase,
  updateSinglePostFromDatabase,
  updateAPostPremiumInDatabase,
};

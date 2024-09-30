import httpStatus from "http-status";
import catchAsyncErrors from "../../utils/catchAsyncError";
import sendResponse from "../../utils/sendResponse";

import { PostServices } from "./post.services";

const createPost = catchAsyncErrors(async (req, res) => {
  const result = await PostServices.createPostInDatabase(
    req.body,
    req.file?.path as string,
  );
  sendResponse(res, {
    success: true,
    result,
    statusCode: httpStatus.CREATED,
    message: "Successfully Created",
  });
});

const getAllPost = catchAsyncErrors(async (req, res) => {
  const result = await PostServices.getAllPostInDatabase();
  sendResponse(res, {
    success: true,
    result,
    statusCode: httpStatus.OK,
    message: "Successfully Retrieved All Posts",
  });
});

const getSinglePost = catchAsyncErrors(async (req, res) => {
  const result = await PostServices.getSinglePostFromDatabase(
    req.params.postId,
  );
  sendResponse(res, {
    success: true,
    result,
    statusCode: httpStatus.OK,
    message: "Successfully Retrieved A Post",
  });
});

const updateASinglePost = catchAsyncErrors(async (req, res) => {
  const result = await PostServices.updateSinglePostFromDatabase(
    req.params.postId,
    req.body,
  );
  sendResponse(res, {
    success: true,
    result,
    statusCode: httpStatus.OK,
    message: "Successfully Update A Post",
  });
});

const deleteASinglePost = catchAsyncErrors(async (req, res) => {
  const result = await PostServices.deleteSinglePostFromDatabase(
    req.params.postId,
  );
  sendResponse(res, {
    success: true,
    result,
    statusCode: httpStatus.OK,
    message: "Successfully Delete A Post",
  });
});

const updateAPostInPremium = catchAsyncErrors(async (req, res) => {
  const result = await PostServices.updateAPostPremiumInDatabase(
    req.params.postId,
  );
  sendResponse(res, {
    success: true,
    result,
    statusCode: httpStatus.OK,
    message: "Successfully Update A Post In Premium",
  });
});
export const PostController = {
  createPost,
  getAllPost,
  getSinglePost,
  updateAPostInPremium,
  updateASinglePost,
  deleteASinglePost,
};

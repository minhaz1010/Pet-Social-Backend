import httpStatus from "http-status";
import catchAsyncErrors from "../../utils/catchAsyncError";
import sendResponse from "../../utils/sendResponse";

import { PostServices } from "./post.services";

// NOTE: create post controller

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

// NOTE: get all post controller
const getAllPost = catchAsyncErrors(async (req, res) => {
  const result = await PostServices.getAllPostInDatabase();
  sendResponse(res, {
    success: true,
    result,
    statusCode: httpStatus.OK,
    message: "Successfully Retrieved All Posts",
  });
});

// NOTE: get single post controller by post id
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
// NOTE: update single post controller by post id
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

// NOTE: delete single post controller by post id
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

// NOTE: update a free post to premium controller by post id
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

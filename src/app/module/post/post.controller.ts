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

export const PostController = {
  createPost,
};

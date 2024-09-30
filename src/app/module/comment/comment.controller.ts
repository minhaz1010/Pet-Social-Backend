import httpStatus from "http-status";
import catchAsyncErrors from "../../utils/catchAsyncError";
import sendResponse from "../../utils/sendResponse";
import { CommentServices } from "./comment.services";

// NOTE: post a comment in a post controller
const postAComment = catchAsyncErrors(async (req, res) => {
  const result = await CommentServices.postAComment(
    req.params.postId,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    result,
    message: "Successfully Commit A Comment",
  });
});
// NOTE: get all comments of a post controller
const getAllCommentsOfAPost = catchAsyncErrors(async (req, res) => {
  const result = await CommentServices.getAllCommentsOfAPost(req.params.postId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    result,
    message: "Successfully Get All Comments",
  });
});

// NOTE: delete single comments of a post controller
const deleteASingleCommentsOfAPost = catchAsyncErrors(async (req, res) => {
  const result = await CommentServices.deleteASingleCommentsOfAPost(
    req.params.commentId,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    result,
    message: "Deleted A Comment",
  });
});
// NOTE: edit/update of a single comment of a post controller
const updateASingleCommentOfAPost = catchAsyncErrors(async (req, res) => {
  const result = await CommentServices.updateASingleCommentOfAPost(
    req.params.commentId,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    result,
    message: "Updated A Comment",
  });
});

export const CommentControllers = {
  postAComment,
  getAllCommentsOfAPost,
  updateASingleCommentOfAPost,
  deleteASingleCommentsOfAPost,
};

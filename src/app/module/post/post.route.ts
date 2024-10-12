import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { PostValidation } from "./post.validation";
import { PostController } from "./post.controller";
import { CommentControllers } from "../comment/comment.controller";
import { CommentValidation } from "../comment/comment.validation";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = express.Router();
// Post related routes
router.post(
  "/create-post",
  ClerkExpressRequireAuth(),
  validateRequest(PostValidation.createPostValidation),
  PostController.createPost,
);

router.get("/", PostController.getAllPost);

router.get("/:postId", PostController.getSinglePost);
router.patch("/:postId", PostController.updateASinglePost);
router.delete("/:postId", PostController.deleteASinglePost);

// like and dislikes related routes

router.patch(
  "/likes/:postId",
  ClerkExpressRequireAuth(),
  PostController.likeAPost,
);
router.patch(
  "/dislikes/:postId",
  ClerkExpressRequireAuth(),
  PostController.disLikeAPost,
);

// Comment Related routes
router.post(
  "/comments/:postId",
  ClerkExpressRequireAuth(),
  validateRequest(CommentValidation.createCommentValidation),
  CommentControllers.postAComment,
);
router.get("/comments/:postId", CommentControllers.getAllCommentsOfAPost);
router.patch(
  "/comments/:commentId",
  validateRequest(CommentValidation.updateCommentValidation),
  CommentControllers.updateASingleCommentOfAPost,
);
router.delete(
  "/comments/:commentId",
  CommentControllers.deleteASingleCommentsOfAPost,
);
// like and dislike of a comment
router.patch(
  "/comments/like/:commentId",
  ClerkExpressRequireAuth(),
  CommentControllers.likeAComment,
);

router.patch(
  "/comments/dislike/:commentId",
  ClerkExpressRequireAuth(),
  CommentControllers.dislikeAComment,
);

export const PostRouter = router;

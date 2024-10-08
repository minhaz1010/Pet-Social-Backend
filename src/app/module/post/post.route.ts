import e, { NextFunction, Request, Response } from "express";
import { mutlerUpload } from "../../config/mutler.config";
import validateRequest from "../../middleware/validateRequest";
import { PostValidation } from "./post.validation";
import { PostController } from "./post.controller";
import { resizeImageOfPost } from "../../middleware/resizImage";
import { CommentControllers } from "../comment/comment.controller";
import { CommentValidation } from "../comment/comment.validation";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = e.Router();
// Post related routes
router.post(
  "/create-post",
  ClerkExpressRequireAuth(),
  mutlerUpload.single("image"),
  resizeImageOfPost,
  async (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(PostValidation.createPostValidation),
  PostController.createPost,
);

router.get("/", PostController.getAllPost);

router.get("/:postId", PostController.getSinglePost);
router.patch("/:postId", PostController.updateASinglePost);
router.patch("/premium/:postId", PostController.updateAPostInPremium);
router.delete("/:postId", PostController.deleteASinglePost);

// like and dislikes related routes

router.patch("/likes/:postId",ClerkExpressRequireAuth(),PostController.likeAPost);
router.patch("/dislikes/:postId",ClerkExpressRequireAuth(),PostController.disLikeAPost);


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
export const PostRouter = router;

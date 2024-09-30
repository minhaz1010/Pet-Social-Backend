import e, { NextFunction, Request, Response } from "express";
import { mutlerUpload } from "../../config/mutler.config";
import validateRequest from "../../middleware/validateRequest";
import { PostValidation } from "./post.validation";
import { PostController } from "./post.controller";
import { resizeImageOfPost } from "../../middleware/resizImage";

const router = e.Router();

router.post(
  "/create-post",
  mutlerUpload.single("image"),
  resizeImageOfPost,
  async (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(PostValidation.createPostValidation),
  PostController.createPost,
);

export const PostRouter = router;

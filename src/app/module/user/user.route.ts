import e from "express";
import { UserController } from "./user.controller";
import { mutlerUpload } from "../../config/mutler.config";
const router = e.Router();

router.post(
  "/",
  mutlerUpload.single("image"),
  UserController.resizeImage,
  UserController.image,
);
export default router;

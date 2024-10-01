import e from "express";
import { UserController } from "./user.controller";
const router = e.Router();

router.get("/", UserController.getAllUserFromDatabase);
router.get("/me",UserController.getAUserDetails);
// NOTE: follower routes
router.post("/follow/:followerId", UserController.followUser);
router.post("/unfollow/:followerId", UserController.unfollowUser);

export const UserRouter = router;

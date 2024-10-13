import e from "express";
import { UserController } from "./user.controller";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
const router = e.Router();

router.get("/", UserController.getAllUserFromDatabase);
router.get("/details/:userName", UserController.getAUserDetailsByUserName);
router.get("/me", ClerkExpressRequireAuth(), UserController.getAUserDetails);
// NOTE: follower routes
router.post(
  "/follow/:followerId",
  ClerkExpressRequireAuth(),
  UserController.followUser,
);
router.post(
  "/unfollow/:followerId",
  ClerkExpressRequireAuth(),
  UserController.unfollowUser,
);

router.get(
  "/get-all-users",
  ClerkExpressRequireAuth(),
  UserController.getAllUserFromDatabase,
);

router.patch(
  "/update-role/:id",
  ClerkExpressRequireAuth(),
  UserController.changeRole,
);

router.delete(
  "/delete/:id",
  ClerkExpressRequireAuth(),
  UserController.deleteAUser,
);

export const UserRouter = router;

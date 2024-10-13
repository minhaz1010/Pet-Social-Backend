"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const router = express_1.default.Router();
router.get("/", user_controller_1.UserController.getAllUserFromDatabase);
router.get("/details/:userName", user_controller_1.UserController.getAUserDetailsByUserName);
router.get("/me", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), user_controller_1.UserController.getAUserDetails);
// NOTE: follower routes
router.post("/follow/:followerId", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), user_controller_1.UserController.followUser);
router.post("/unfollow/:followerId", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), user_controller_1.UserController.unfollowUser);
router.get("/get-all-users", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), user_controller_1.UserController.getAllUserFromDatabase);
router.patch("/update-role/:id", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), user_controller_1.UserController.changeRole);
router.delete("/delete/:id", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), user_controller_1.UserController.deleteAUser);
exports.UserRouter = router;

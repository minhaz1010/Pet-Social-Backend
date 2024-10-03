"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
router.get("/", user_controller_1.UserController.getAllUserFromDatabase);
router.get("/me", user_controller_1.UserController.getAUserDetails);
// NOTE: follower routes
router.post("/follow/:followerId", user_controller_1.UserController.followUser);
router.post("/unfollow/:followerId", user_controller_1.UserController.unfollowUser);
exports.UserRouter = router;

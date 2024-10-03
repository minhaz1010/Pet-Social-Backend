"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRouter = void 0;
const express_1 = __importDefault(require("express"));
const mutler_config_1 = require("../../config/mutler.config");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const post_validation_1 = require("./post.validation");
const post_controller_1 = require("./post.controller");
const resizImage_1 = require("../../middleware/resizImage");
const comment_controller_1 = require("../comment/comment.controller");
const comment_validation_1 = require("../comment/comment.validation");
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const router = express_1.default.Router();
// Post related routes
router.post("/create-post", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), mutler_config_1.mutlerUpload.single("image"), resizImage_1.resizeImageOfPost, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.body = JSON.parse(req.body.data);
    next();
}), (0, validateRequest_1.default)(post_validation_1.PostValidation.createPostValidation), post_controller_1.PostController.createPost);
router.get("/", post_controller_1.PostController.getAllPost);
router.get("/:postId", post_controller_1.PostController.getSinglePost);
router.patch("/:postId", post_controller_1.PostController.updateASinglePost);
router.patch("/premium/:postId", post_controller_1.PostController.updateAPostInPremium);
router.delete("/:postId", post_controller_1.PostController.deleteASinglePost);
// like and dislikes related routes
router.patch("/likes/:postId", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), post_controller_1.PostController.likeAPost);
router.patch("/dislikes/:postId", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), post_controller_1.PostController.disLikeAPost);
// Comment Related routes
router.post("/comments/:postId", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), (0, validateRequest_1.default)(comment_validation_1.CommentValidation.createCommentValidation), comment_controller_1.CommentControllers.postAComment);
router.get("/comments/:postId", comment_controller_1.CommentControllers.getAllCommentsOfAPost);
router.patch("/comments/:commentId", (0, validateRequest_1.default)(comment_validation_1.CommentValidation.updateCommentValidation), comment_controller_1.CommentControllers.updateASingleCommentOfAPost);
router.delete("/comments/:commentId", comment_controller_1.CommentControllers.deleteASingleCommentsOfAPost);
exports.PostRouter = router;

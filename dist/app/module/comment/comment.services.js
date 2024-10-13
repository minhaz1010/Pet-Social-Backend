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
exports.CommentServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../errors/appError"));
const post_model_1 = require("../post/post.model");
const comment_model_1 = require("./comment.model");
const user_model_1 = require("../user/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
// NOTE: post a comment in a  post
const postAComment = (postId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const postExist = yield post_model_1.Post.findById(postId);
    if (!postExist) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "No Post Found ");
    }
    const userData = yield user_model_1.User.findOne({ userId: payload.author });
    const updatePayload = Object.assign(Object.assign({}, payload), { post: postId, author: userData === null || userData === void 0 ? void 0 : userData._id });
    const result = yield comment_model_1.Comment.create(updatePayload);
    return result;
});
// NOTE: get all comments of a post by postId
const getAllCommentsOfAPost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const postExist = yield post_model_1.Post.findById(postId);
    if (!postExist) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "No Post Found ");
    }
    const result = yield comment_model_1.Comment.find({ post: postId }).sort("-createdAt");
    if (result.length === 0) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Sorry No Comments Found For This Post");
    }
    return result;
});
// NOTE: delete a single comment of a post by commentId
const deleteASingleCommentsOfAPost = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    const commentExist = yield comment_model_1.Comment.findById(commentId);
    if (!commentExist) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "No Comment Found");
    }
    yield comment_model_1.Comment.findByIdAndDelete(commentId);
    return null;
});
// NOTE: update a single comment of a post by commentId
const updateASingleCommentOfAPost = (commentId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const commentExist = yield comment_model_1.Comment.findById(commentId);
    if (!commentExist) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "No Comment Found");
    }
    const result = yield comment_model_1.Comment.findByIdAndUpdate(commentId, payload, {
        new: true,
    });
    return result;
});
const likeAComment = (commentId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield user_model_1.User.findOne({ userId });
    const commentData = yield comment_model_1.Comment.findById(commentId);
    const userObjectId = new mongoose_1.default.Types.ObjectId(userData === null || userData === void 0 ? void 0 : userData._id);
    if (!commentData) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "No Comment Found");
    }
    if (commentData.dislikedBy.includes(userObjectId)) {
        commentData.dislikedBy = commentData.dislikedBy.filter((id) => id === userObjectId);
        commentData.dislikes -= 1;
    }
    if (commentData.likedBy.includes(userObjectId)) {
        commentData.likedBy = commentData.likedBy.filter((id) => id === userObjectId);
        if (commentData.likes > 0) {
            commentData.likes -= 1;
        }
    }
    else {
        commentData.likedBy.push(userObjectId);
        commentData.likes += 1;
    }
    const result = yield commentData.save();
    return result;
});
const disLikeAComment = (commentId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield user_model_1.User.findOne({ userId });
    const commentData = yield comment_model_1.Comment.findById(commentId);
    const userObjectId = new mongoose_1.default.Types.ObjectId(userData === null || userData === void 0 ? void 0 : userData._id);
    if (!commentData) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "No Comment Found");
    }
    if (commentData.likedBy.includes(userObjectId)) {
        commentData.likedBy = commentData.likedBy.filter((id) => id === userObjectId);
        commentData.likes -= 1;
    }
    if (commentData === null || commentData === void 0 ? void 0 : commentData.dislikedBy.includes(userObjectId)) {
        commentData.dislikedBy = commentData.dislikedBy.filter((id) => id === userObjectId);
        if (commentData.dislikedBy) {
            commentData.dislikes -= 1;
        }
    }
    else {
        commentData.dislikedBy.push(userObjectId);
        commentData.dislikes += 1;
    }
    const result = yield commentData.save();
    return result;
});
exports.CommentServices = {
    postAComment,
    getAllCommentsOfAPost,
    deleteASingleCommentsOfAPost,
    updateASingleCommentOfAPost,
    likeAComment,
    disLikeAComment,
};

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
exports.CommentControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const comment_services_1 = require("./comment.services");
// NOTE: post a comment in a post controller
const postAComment = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.auth.userId;
    req.body.author = userId;
    const result = yield comment_services_1.CommentServices.postAComment(req.params.postId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        result,
        message: "Successfully Commit A Comment",
    });
}));
// NOTE: get all comments of a post controller
const getAllCommentsOfAPost = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_services_1.CommentServices.getAllCommentsOfAPost(req.params.postId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        result,
        message: "Successfully Get All Comments",
    });
}));
// NOTE: delete single comments of a post controller
const deleteASingleCommentsOfAPost = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_services_1.CommentServices.deleteASingleCommentsOfAPost(req.params.commentId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        result,
        message: "Deleted A Comment",
    });
}));
// NOTE: edit/update of a single comment of a post controller
const updateASingleCommentOfAPost = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_services_1.CommentServices.updateASingleCommentOfAPost(req.params.commentId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        result,
        message: "Updated A Comment",
    });
}));
const likeAComment = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.auth.userId;
    // const userId = "user_2n8JsKyG5g4roI6D3zHissu8imU";
    const commentId = req.params.commentId;
    const result = yield comment_services_1.CommentServices.likeAComment(commentId, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Successfully Liked The Comment",
        result,
        statusCode: http_status_1.default.OK,
    });
}));
const dislikeAComment = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.auth.userId;
    // const userId = "user_2n8JsKyG5g4roI6D3zHissu8imU";
    const commentId = req.params.commentId;
    const result = yield comment_services_1.CommentServices.disLikeAComment(commentId, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Successfully Disliked The Comment",
        result,
        statusCode: http_status_1.default.OK,
    });
}));
exports.CommentControllers = {
    postAComment,
    getAllCommentsOfAPost,
    updateASingleCommentOfAPost,
    deleteASingleCommentsOfAPost,
    likeAComment,
    dislikeAComment,
};

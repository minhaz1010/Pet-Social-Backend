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
exports.PostController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const post_services_1 = require("./post.services");
// NOTE: create post controller
const createPost = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_services_1.PostServices.createPostInDatabase(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        result,
        statusCode: http_status_1.default.CREATED,
        message: "Successfully Created",
    });
}));
// NOTE: get all post controller
const getAllPost = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, category } = req.query;
    const result = yield post_services_1.PostServices.getAllPostInDatabase(Number(page), Number(limit), category);
    (0, sendResponse_1.default)(res, {
        success: true,
        result,
        statusCode: http_status_1.default.OK,
        message: "Successfully Retrieved All Posts",
    });
}));
// NOTE: get single post controller by post id
const getSinglePost = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_services_1.PostServices.getSinglePostFromDatabase(req.params.postId);
    (0, sendResponse_1.default)(res, {
        success: true,
        result,
        statusCode: http_status_1.default.OK,
        message: "Successfully Retrieved A Post",
    });
}));
// NOTE: update single post controller by post id
const updateASinglePost = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_services_1.PostServices.updateSinglePostFromDatabase(req.params.postId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        result,
        statusCode: http_status_1.default.OK,
        message: "Successfully Update A Post",
    });
}));
// NOTE: delete single post controller by post id
const deleteASinglePost = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_services_1.PostServices.deleteSinglePostFromDatabase(req.params.postId);
    (0, sendResponse_1.default)(res, {
        success: true,
        result,
        statusCode: http_status_1.default.OK,
        message: "Successfully Delete A Post",
    });
}));
// NOTE: update a free post to premium controller by post id
const updateAPostInPremium = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_services_1.PostServices.updateAPostPremiumInDatabase(req.params.postId);
    (0, sendResponse_1.default)(res, {
        success: true,
        result,
        statusCode: http_status_1.default.OK,
        message: "Successfully Update A Post In Premium",
    });
}));
const likeAPost = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.auth.userId;
    const postId = req.params.postId;
    const result = yield post_services_1.PostServices.likeAPost(postId, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Successfully Liked The Post",
        result,
        statusCode: http_status_1.default.OK,
    });
}));
const disLikeAPost = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.auth.userId;
    // const userId="user_2mn8oOL0b8rXSChtbd0sDfibfHs";
    const postId = req.params.postId;
    const result = yield post_services_1.PostServices.disLikeAPost(postId, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Successfully Dislike The Post",
        result,
        statusCode: http_status_1.default.OK,
    });
}));
exports.PostController = {
    createPost,
    getAllPost,
    getSinglePost,
    updateAPostInPremium,
    updateASinglePost,
    deleteASinglePost,
    likeAPost,
    disLikeAPost,
};

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
exports.PostServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../errors/appError"));
const post_model_1 = require("./post.model");
const user_model_1 = require("../user/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
// NOTE: create post in database
const createPostInDatabase = (payload, imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ userId: payload.author });
    const post = Object.assign(Object.assign({}, payload), { author: user === null || user === void 0 ? void 0 : user._id, imageURL: imageUrl });
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const postData = yield post_model_1.Post.create([post], { session });
        if (postData.length === 0) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Could Not Create Post");
        }
        const updatedUser = yield user_model_1.User.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, {
            $push: { posts: postData[0]._id },
        }, {
            new: true,
            session,
        });
        if (!updatedUser) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Could Not Update User");
        }
        yield session.commitTransaction();
        return postData;
    }
    catch (error) {
        yield session.abortTransaction();
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Could Not Create Post and update the user");
    }
    finally {
        session.endSession();
    }
});
// NOTE: get all posts from database
const getAllPostInDatabase = (page, limit, category) => __awaiter(void 0, void 0, void 0, function* () {
    let query = post_model_1.Post.find();
    if (category) {
        query = query.where('postType').equals(category);
    }
    const result = yield query
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
        path: "author",
        select: "userName imageURL"
    })
        .sort("-createdAt");
    const totalPosts = yield post_model_1.Post.countDocuments(category ? { postType: category } : {});
    if (result.length === 0) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Sorry, No Posts Found");
    }
    return {
        result,
        totalPosts
    };
});
// NOTE: get single post from database by postId
const getSinglePostFromDatabase = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.findById(postId).populate("author");
    if (!result) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Sorry, No Post Found");
    }
    return result;
});
// NOTE: update a single post by postId
const updateSinglePostFromDatabase = (postId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const postExist = yield post_model_1.Post.findById(postId);
    if (!postExist) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "No Post Found For Update");
    }
    const result = yield post_model_1.Post.findByIdAndUpdate(postId, payload, { new: true });
    return result;
});
// NOTE: delete single post by postId
const deleteSinglePostFromDatabase = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const postExist = yield post_model_1.Post.findById(postId);
    if (!postExist) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "No Post Found For Delete");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const postData = yield post_model_1.Post.findByIdAndDelete(postId, {
            session,
            new: true,
        });
        if (!postData) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Could not delete the post");
        }
        const updateUser = yield user_model_1.User.findByIdAndUpdate(postExist.author, {
            $pull: { posts: postId },
        }, {
            new: true,
            session,
        });
        if (!updateUser) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Could not update the user");
        }
        yield session.commitTransaction();
        return null;
    }
    catch (error) {
        yield session.abortTransaction();
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Could Not delete the post and update the user");
    }
    finally {
        yield session.endSession();
    }
});
// NOTE: update a post free to premium by postId
const updateAPostPremiumInDatabase = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const postExist = yield post_model_1.Post.findById(postId);
    if (!postExist) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "No Post Found For Update");
    }
    const result = yield post_model_1.Post.findByIdAndUpdate(postId, { isPremium: true }, { new: true });
    return result;
});
// likes and dislikes
const likeAPost = (postId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield user_model_1.User.findOne({ userId });
    const postData = yield post_model_1.Post.findById(postId);
    const userObjectId = new mongoose_1.default.Types.ObjectId(userData === null || userData === void 0 ? void 0 : userData._id);
    if (!postData) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'No Post Found');
    }
    if (postData.dislikedBy.includes(userObjectId)) {
        postData.dislikedBy = postData.dislikedBy.filter((id) => id === userObjectId);
        postData.dislikes -= 1;
    }
    if (postData.likedBy.includes(userObjectId)) {
        postData.likedBy = postData.likedBy.filter((id) => id === userObjectId);
        if (postData.likes > 0) {
            postData.likes -= 1;
        }
    }
    else {
        postData.likedBy.push(userObjectId);
        postData.likes += 1;
    }
    const result = yield postData.save();
    return result;
});
const disLikeAPost = (postId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield user_model_1.User.findOne({ userId });
    const postData = yield post_model_1.Post.findById(postId);
    const userObjectId = new mongoose_1.default.Types.ObjectId(userData === null || userData === void 0 ? void 0 : userData._id);
    if (!postData) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'No Post Found');
    }
    if (postData.likedBy.includes(userObjectId)) {
        postData.likedBy = postData.likedBy.filter((id) => id === userObjectId);
        postData.likes -= 1;
    }
    if (postData === null || postData === void 0 ? void 0 : postData.dislikedBy.includes(userObjectId)) {
        postData.dislikedBy = postData.dislikedBy.filter((id) => id === userObjectId);
        if (postData.dislikedBy) {
            postData.dislikes -= 1;
        }
    }
    else {
        postData.dislikedBy.push(userObjectId);
        postData.dislikes += 1;
    }
    const result = yield postData.save();
    return result;
});
exports.PostServices = {
    createPostInDatabase,
    getAllPostInDatabase,
    getSinglePostFromDatabase,
    deleteSinglePostFromDatabase,
    updateSinglePostFromDatabase,
    updateAPostPremiumInDatabase,
    likeAPost,
    disLikeAPost
};

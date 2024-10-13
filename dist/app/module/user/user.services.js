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
exports.UserServices = exports.deleteAUserInDatabase = exports.changeRole = void 0;
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const user_model_1 = require("./user.model");
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
// NOTE: create user in Clerk and then save in our own database
const createUserInDatabaseFromClerk = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload) {
        const userId = payload.id;
        const userName = payload.username || "haha";
        const fullName = `${payload.first_name || "srk"} ${payload.last_name || "salman"}`;
        const email = payload.email_addresses[0].email_address;
        const imageURL = payload.image_url;
        yield clerk_sdk_node_1.clerkClient.users.updateUser(userId, {
            publicMetadata: { role: "USER" },
        });
        const user = {
            userId,
            userName,
            fullName,
            email,
            imageURL,
        };
        yield user_model_1.User.create(user);
    }
});
// NOTE: update user in clerk and then save in our own database
const updateUserInDatabaseFromClerk = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload) {
        const userId = payload.id;
        const userName = payload.username;
        const fullName = `${payload.first_name} ${payload.last_name}`;
        const email = payload.email_addresses[0].email_address;
        const imageURL = payload.image_url;
        const user = {
            userId,
            userName,
            fullName,
            email,
            imageURL,
        };
        yield user_model_1.User.findOneAndUpdate({ userId }, user, { new: true });
    }
});
// NOTE:  delete user in clerk and then save in out own database
const deleteUserInDatabaseFromClerk = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload) {
        const userId = payload.id;
        yield user_model_1.User.findOneAndDelete({ userId });
    }
});
// NOTE: get all users from our own database
const getAllUserFromDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.find();
    return result;
});
// NOTE: a user details(fe e hit korle okhan theke clerk er maddhome req.auth.userId hote information pabo then get korbo ekhon manually kortesi)
const getAUserDetails = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findOne({ userId })
        .populate({
        path: "followers",
        select: "userName email imageURL",
    })
        .populate({
        path: "followings",
        select: "userName email imageURL",
    })
        .populate({
        path: "posts",
    });
    return result;
});
// NOTE: follow a user/author by followerId(whom to follow)
const followUser = (followerId, followedUserId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // ^ jake follow korbo take khujlam
    const followerUser = yield user_model_1.User.findById(followerId);
    // ^ naa paile bolbo paai naai
    if (!followerUser) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Follower user not found");
    }
    //  ^ je user follow korbe taake khujlam
    const followedUser = yield user_model_1.User.findOne({ userId: followedUserId });
    // ^ naa paile bolbo paai naai
    if (!followedUser) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "User to be followed not found");
    }
    const followedUser_id = followedUser._id;
    //  ^ je user follow korbe sei user er id ke object id te rupantor korlam
    const followedUserObjectId = new mongoose_1.default.Types.ObjectId(followedUser_id);
    //  ^ check kortesi je user ki aage theke follower ke follow kore kina
    const isAlreadyFollowing = (_a = followerUser.followers) === null || _a === void 0 ? void 0 : _a.includes(followedUserObjectId);
    //  ^ jodi user aage theke follow kore tahole ei message dibo
    if (isAlreadyFollowing) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "You are already following this user");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // jare follow korbo taar followers e je user follow korbe tar id dhukaiya dilam
        const updatedFollower = yield user_model_1.User.findByIdAndUpdate(followerId, { $push: { followers: followedUserObjectId } }, { new: true, session });
        if (!updatedFollower) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to update follower's following list");
        }
        //  ^ je user follow korbe taar followers e followerId dhukaiya dilam
        const updatedFollowedUser = yield user_model_1.User.findByIdAndUpdate(followedUserObjectId, { $push: { followings: followerId } }, { new: true, session });
        if (!updatedFollowedUser) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to update user's followers list");
        }
        yield session.commitTransaction();
        return {
            updatedFollower,
            updatedFollowedUser,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Transaction failed: Unable to follow/unfollow user");
    }
    finally {
        session.endSession();
    }
});
// NOTE: unfollow a user/author by followerId(whom to unfollow)
const unfollowUser = (followerId, followedUserId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // followerId ==> minhaz1111
    // followedUserId ==> minhaz1010
    // ^ check kortesi jare unfollow korbo se ache kina
    const followerUser = yield user_model_1.User.findById(followerId);
    if (!followerUser) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Follower user not found");
    }
    // ^ check kortesi je user unfollow korbe se ache kina
    const followedUser = yield user_model_1.User.findOne({ userId: followedUserId });
    if (!followedUser) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "User to be followed not found");
    }
    const followerUser_id = followedUser._id;
    const followedUserObjectId = new mongoose_1.default.Types.ObjectId(followerUser_id);
    //  check kortesi je user follow korbe sei follower er followings e userId ache kina
    const isAlreadyFollowing = (_a = followerUser.followers) === null || _a === void 0 ? void 0 : _a.includes(followedUserObjectId);
    //  jodi userId naa thake taar mane se already taake unfollow kore
    if (!isAlreadyFollowing) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "You have already unfollowed this user");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //  jaake unfollow korbo taar followers theke userId remove korlam
        const updatedFollower = yield user_model_1.User.findByIdAndUpdate(followerId, { $pull: { followers: followedUserObjectId } }, { new: true, session });
        if (!updatedFollower) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to update follower's following list");
        }
        // je unfollow korbe taar followings theke follwerId remove korlam hehe
        const updatedFollowedUser = yield user_model_1.User.findByIdAndUpdate(followedUserObjectId, { $pull: { followings: followerId } }, { new: true, session });
        if (!updatedFollowedUser) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to update user's followers list");
        }
        yield session.commitTransaction();
        return {
            updatedFollower,
            updatedFollowedUser,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Transaction failed: Unable to follow/unfollow user");
    }
    finally {
        session.endSession();
    }
});
const getAUserDetailsByUserName = (userName) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findOne({ userName })
        .populate({
        path: "followers",
        select: "userName email imageURL userId",
    })
        .populate({
        path: "followings",
        select: "userName email imageURL userId",
    })
        .populate({
        path: "posts",
        populate: {
            path: "author",
            select: "userName email imageURL",
        },
    });
    return result;
});
// userId is mongodb _id
const changeRole = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield user_model_1.User.findById(id);
    yield clerk_sdk_node_1.clerkClient.users.updateUser(userData === null || userData === void 0 ? void 0 : userData.userId, {
        publicMetadata: { role },
    });
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(id, { role }, { new: true });
    return updatedUser;
});
exports.changeRole = changeRole;
//  id is mongodb _id
const deleteAUserInDatabase = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield user_model_1.User.findById(id);
    yield clerk_sdk_node_1.clerkClient.users.deleteUser(userData === null || userData === void 0 ? void 0 : userData.userId);
    yield user_model_1.User.findByIdAndDelete(id);
    return null;
});
exports.deleteAUserInDatabase = deleteAUserInDatabase;
exports.UserServices = {
    createUserInDatabaseFromClerk,
    updateUserInDatabaseFromClerk,
    deleteUserInDatabaseFromClerk,
    getAllUserFromDatabase,
    getAUserDetails,
    followUser,
    unfollowUser,
    getAUserDetailsByUserName,
    changeRole: exports.changeRole,
    deleteAUserInDatabase: exports.deleteAUserInDatabase,
};

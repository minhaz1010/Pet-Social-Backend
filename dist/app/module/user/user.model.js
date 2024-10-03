"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    userName: {
        type: String,
        unique: true,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    imageURL: {
        type: String,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    posts: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Post",
        },
    ],
    followers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    followings: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    membership: {
        type: String,
        enum: ["REGULAR", "PREMIUM"],
        default: "REGULAR",
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
}, {
    timestamps: true,
});
exports.User = (0, mongoose_1.model)("User", userSchema);

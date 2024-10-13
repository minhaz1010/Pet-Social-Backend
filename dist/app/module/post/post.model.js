"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    petType: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
    postType: {
        type: String,
        enum: ["STORY", "TIP"],
        default: "STORY",
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    image: [
        {
            public_id: { type: String },
            secure_url: { type: String },
        },
    ],
    likedBy: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    dislikedBy: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
}, {
    timestamps: true,
});
exports.Post = (0, mongoose_1.model)("Post", postSchema);

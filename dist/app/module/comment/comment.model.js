"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
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
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    post: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
}, {
    timestamps: true,
});
exports.Comment = (0, mongoose_1.model)("Comment", commentSchema);

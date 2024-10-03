"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const createCommentValidation = zod_1.default.object({
    body: zod_1.default.object({
        content: zod_1.default.string(),
    }),
});
const updateCommentValidation = zod_1.default.object({
    body: zod_1.default.object({
        content: zod_1.default.string().optional(),
        author: zod_1.default.string().optional(),
        post: zod_1.default.string().optional(),
        likes: zod_1.default.number().optional(),
        dislikes: zod_1.default.number().optional(),
    }),
});
exports.CommentValidation = {
    createCommentValidation,
    updateCommentValidation,
};

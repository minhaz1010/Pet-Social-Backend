"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const createPostValidation = zod_1.default.object({
    body: zod_1.default.object({
        title: zod_1.default.string(),
        petType: zod_1.default.string(),
        content: zod_1.default.string(),
        postType: zod_1.default.enum(["TIP", "STORY"]),
        author: zod_1.default.string(),
        isPremium: zod_1.default.boolean().optional(),
    }),
});
const updatePostValidation = zod_1.default.object({
    body: zod_1.default.object({
        title: zod_1.default.string().optional(),
        content: zod_1.default.string().optional(),
        petType: zod_1.default.string().optional(),
        imageURL: zod_1.default.string().url().optional(),
        postType: zod_1.default.enum(["TIP", "STORY"]).optional(),
        isPremium: zod_1.default.boolean().optional(),
        likes: zod_1.default.number().optional(),
        dislikes: zod_1.default.number().optional(),
    }),
});
exports.PostValidation = {
    createPostValidation,
    updatePostValidation,
};

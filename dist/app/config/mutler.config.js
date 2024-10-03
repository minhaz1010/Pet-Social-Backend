"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutlerUpload = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_config_1 = require("./cloudinary.config");
const multer_1 = __importDefault(require("multer"));
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_config_1.cloudinaryUpload,
});
exports.mutlerUpload = (0, multer_1.default)({ storage });

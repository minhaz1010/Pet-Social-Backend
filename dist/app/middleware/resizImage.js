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
exports.resizeImageOfPost = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../errors/appError"));
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const cloudinary_1 = require("cloudinary");
exports.resizeImageOfPost = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "There is no image");
    }
    const result = yield cloudinary_1.v2.uploader.upload(req.file.path, {
        transformation: [
            {
                width: 600,
                height: 600,
                crop: "limit",
                quality: "auto",
                fetch_format: "auto",
            },
        ],
        public_id: req.file.filename,
        overwrite: true,
    });
    req.file.path = result.secure_url;
    req.file.filename = result.public_id;
    next();
}));

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const handleCastError = (err) => {
    const statusCode = http_status_1.default.BAD_REQUEST;
    const message = err.message;
    const errorMessages = [
        {
            path: err.path,
            message: err.message,
        },
    ];
    return {
        statusCode,
        message,
        errorMessages,
    };
};
exports.default = handleCastError;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable  @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const handleDuplicateError = (err) => {
    const message = "Duplicate Error";
    const statusCode = http_status_1.default.CONFLICT;
    const match = err.message.match(/"([^"]*)"/);
    const extractedMessage = match && match[1];
    const errorMessages = [
        {
            path: "",
            message: extractedMessage + " is already exist",
        },
    ];
    return {
        message,
        statusCode,
        errorMessages,
    };
};
exports.default = handleDuplicateError;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notBeforeError = exports.handleJsonWebTokenError = exports.handleTokenExpiredError = void 0;
const http_status_1 = __importDefault(require("http-status"));
const handleTokenExpiredError = (err) => {
    const statusCode = http_status_1.default.FORBIDDEN;
    const message = "Token expired";
    const errorMessages = [
        {
            path: "",
            message: err.name,
        },
    ];
    return {
        statusCode,
        message,
        errorMessages,
    };
};
exports.handleTokenExpiredError = handleTokenExpiredError;
const handleJsonWebTokenError = (err) => {
    const statusCode = http_status_1.default.FORBIDDEN;
    const message = "Invalid token - the header or payload could not be parsed or jwt malformed";
    const errorMessages = [
        {
            path: "",
            message: err.name,
        },
    ];
    return {
        statusCode,
        message,
        errorMessages,
    };
};
exports.handleJsonWebTokenError = handleJsonWebTokenError;
const notBeforeError = (err) => {
    const statusCode = http_status_1.default.FORBIDDEN;
    const message = "jwt is not active anymore";
    const errorMessages = [
        {
            path: "",
            message: err.name,
        },
    ];
    return {
        statusCode,
        message,
        errorMessages,
    };
};
exports.notBeforeError = notBeforeError;

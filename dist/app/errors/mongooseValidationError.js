"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const mongooseValiDationError = (err) => {
    const statusCode = http_status_1.default.BAD_REQUEST;
    const message = err.name;
    const propertiesName = Object.keys(err.errors);
    const errorMessages = propertiesName.map((field) => {
        return {
            path: field,
            message: field + " is required ",
        };
    });
    return {
        statusCode,
        message,
        errorMessages,
    };
};
exports.default = mongooseValiDationError;

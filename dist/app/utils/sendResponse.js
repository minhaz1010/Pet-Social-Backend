"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    res.status(data.statusCode).json({
        success: true,
        statusCode: data.statusCode,
        message: data.message,
        data: data.result,
    });
};
exports.default = sendResponse;

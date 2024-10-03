"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const config_1 = __importDefault(require("../config"));
const jwtError_1 = require("../errors/jwtError");
const handleCastError_1 = __importDefault(require("../errors/handleCastError"));
const mongooseValidationError_1 = __importDefault(require("../errors/mongooseValidationError"));
const handleDuplicateError_1 = __importDefault(require("../errors/handleDuplicateError"));
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const appError_1 = __importDefault(require("../errors/appError"));
const globalErrorHandler = (err, req, res, next) => {
    var _a;
    let statusCode = 500;
    let message;
    try {
        message = JSON.parse(err.message);
    }
    catch (_b) {
        message = err.message || "Something went wrong";
    }
    let errorMessages = [
        {
            path: "",
            message: "Something went wrong",
        },
    ];
    // INFO: Duplicate error
    // HACK:
    if (err instanceof zod_1.ZodError) {
        const getTheErrorData = (0, handleZodError_1.default)(err);
        message = getTheErrorData.message;
        statusCode = getTheErrorData.statusCode;
        errorMessages = getTheErrorData.errorMessages;
    }
    else if (((_a = err === null || err === void 0 ? void 0 : err.errorResponse) === null || _a === void 0 ? void 0 : _a.code) === 11000) {
        const getTheErrorData = (0, handleDuplicateError_1.default)(err);
        message = getTheErrorData.message;
        statusCode = getTheErrorData.statusCode;
        errorMessages = getTheErrorData.errorMessages;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === "ValidationError") {
        const getTheErrorData = (0, mongooseValidationError_1.default)(err);
        message = getTheErrorData.message;
        statusCode = getTheErrorData.statusCode;
        errorMessages = getTheErrorData.errorMessages;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === "CastError") {
        const getTheErrorData = (0, handleCastError_1.default)(err);
        message = getTheErrorData.message;
        statusCode = getTheErrorData.statusCode;
        errorMessages = getTheErrorData.errorMessages;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === "TokenExpiredError") {
        const getTheErrorData = (0, jwtError_1.handleTokenExpiredError)(err);
        statusCode = getTheErrorData.statusCode;
        message = getTheErrorData.message;
        errorMessages = getTheErrorData.errorMessages;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === "JsonWebTokenError") {
        const getTheErrorData = (0, jwtError_1.handleJsonWebTokenError)(err);
        statusCode = getTheErrorData.statusCode;
        message = getTheErrorData.message;
        errorMessages = getTheErrorData.errorMessages;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === "NotBeforeError") {
        const getTheErrorData = (0, jwtError_1.notBeforeError)(err);
        statusCode = getTheErrorData.statusCode;
        message = getTheErrorData.message;
        errorMessages = getTheErrorData.errorMessages;
    }
    else if (err instanceof appError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
        errorMessages = [
            {
                path: "",
                message: err === null || err === void 0 ? void 0 : err.message,
            },
        ];
    }
    else if (err instanceof Error) {
        message = err.message;
        errorMessages = [
            {
                path: "",
                message: err === null || err === void 0 ? void 0 : err.message,
            },
        ];
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorMessages,
        stack: config_1.default.NODE_ENV === "development" ? err === null || err === void 0 ? void 0 : err.stack : null,
    });
};
exports.default = globalErrorHandler;

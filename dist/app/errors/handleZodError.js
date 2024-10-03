"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (err) => {
    const statusCode = 400;
    const message = "Validation Error";
    const errorMessages = err.issues.map((error) => {
        return {
            path: error.path[error.path.length - 1],
            message: error.message,
        };
    });
    return {
        statusCode,
        message,
        errorMessages,
    };
};
exports.default = handleZodError;

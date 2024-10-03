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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const user_services_1 = require("./user.services");
const webhook_1 = require("../../utils/webhook");
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createUpdateDeleteController = (0, catchAsyncError_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let evt;
        try {
            evt = (0, webhook_1.verifyWebhook)(req);
        }
        catch (err) {
            console.log("Webhook failed to verify. Error:", err.message);
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Something went wrong in webhook");
        }
        const attr = __rest(evt.data, []);
        const eventType = evt.type;
        if (eventType === "user.created") {
            yield user_services_1.UserServices.createUserInDatabaseFromClerk(attr);
        }
        if (eventType === "user.updated") {
            yield user_services_1.UserServices.updateUserInDatabaseFromClerk(attr);
        }
        if (eventType === "user.deleted") {
            yield user_services_1.UserServices.deleteUserInDatabaseFromClerk(attr);
        }
    });
});
const getAllUserFromDatabase = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.UserServices.getAllUserFromDatabase();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        result,
        success: true,
        message: "Successfully Retrieved All Users",
    });
}));
const getAUserDetails = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const userId = req.auth.userId;
    const userId = "user_2mn8oOL0b8rXSChtbd0sDfibfHs";
    const result = yield user_services_1.UserServices.getAUserDetails(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Successfully Get the user",
        success: true,
        result,
    });
}));
const followUser = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.UserServices.followUser(req.params.followerId, req.body.userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Followed Successfully",
        result,
    });
}));
const unfollowUser = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.UserServices.unfollowUser(req.params.followerId, req.body.userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Unfollowed Successfully",
        result,
    });
}));
exports.UserController = {
    createUpdateDeleteController,
    getAllUserFromDatabase,
    followUser,
    unfollowUser,
    getAUserDetails,
};

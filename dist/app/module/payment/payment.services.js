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
exports.PaymentServices = void 0;
const path_1 = __importDefault(require("path"));
const user_model_1 = require("../user/user.model");
const fs_1 = require("fs");
const mongoose_1 = __importDefault(require("mongoose"));
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_1 = __importDefault(require("http-status"));
const payment_model_1 = require("./payment.model");
const formattedDate_1 = require("../../utils/formattedDate");
const confirmPaymentServices = (trxId, userId, month) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path_1.default.join(__dirname, "../../../../public/confirmation.html");
    let template = (0, fs_1.readFileSync)(filePath, "utf-8");
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const user = yield user_model_1.User.findOneAndUpdate({ userId: userId }, { membership: "PREMIUM" }, { new: true, session });
        if (!user) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Could Not Update User Membership");
        }
        let price;
        let currentTimes;
        let endTimes;
        if (month === "1") {
            price = 200;
            const { currentTime, endTime } = (0, formattedDate_1.formattedDate)(30);
            currentTimes = currentTime;
            endTimes = endTime;
        }
        if (month === "3") {
            price = 500;
            const { currentTime, endTime } = (0, formattedDate_1.formattedDate)(90);
            currentTimes = currentTime;
            endTimes = endTime;
        }
        if (month === "6") {
            price = 1000;
            const { currentTime, endTime } = (0, formattedDate_1.formattedDate)(180);
            currentTimes = currentTime;
            endTimes = endTime;
        }
        const paymentOptions = {
            userId: userId,
            price: price,
            month: Number(month),
            status: "PAID",
            startedSubScriptionAt: currentTimes,
            endSubScriptionAt: endTimes,
        };
        const paymentResult = yield payment_model_1.Payment.create([paymentOptions], { session });
        if (paymentResult.length === 0) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Could Not Update Payment");
        }
        yield session.commitTransaction();
        yield session.endSession();
        template = template.replace("{transactionId}", trxId);
        return template;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Something went wrong mama");
    }
});
exports.PaymentServices = {
    confirmPaymentServices,
};

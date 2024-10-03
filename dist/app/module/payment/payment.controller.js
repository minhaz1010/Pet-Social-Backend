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
exports.PaymentController = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const bookingUtils_1 = require("../../utils/bookingUtils");
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const payment_services_1 = require("./payment.services");
const confirmPayment = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId, userId, month } = req.query;
    const response = yield (0, bookingUtils_1.verifyPayment)(transactionId);
    const filePath = path_1.default.join(__dirname, "../../../../public/fail.html");
    const template = (0, fs_1.readFileSync)(filePath, "utf-8");
    try {
        if (response.pay_status === "Successful") {
            const result = yield payment_services_1.PaymentServices.confirmPaymentServices(transactionId, userId, month);
            res.send(result);
        }
        else {
            res.send(template);
        }
    }
    catch (error) {
        res.send(template);
    }
}));
const initializePayment = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const name = (_a = req.auth.sessionClaims) === null || _a === void 0 ? void 0 : _a.name;
    const email = (_b = req.auth.sessionClaims) === null || _b === void 0 ? void 0 : _b.email;
    const address = req.body.address;
    const phone = req.body.phone;
    const totalPrice = req.body.totalPrice;
    const time = String(Date.now());
    const data = {
        month: req.body.month,
        userId: req.auth.userId,
        customerName: name,
        customerAddress: address,
        customerEmail: email,
        customerPhone: phone,
        totalPrice: totalPrice,
        transactionId: time,
    };
    const response = yield (0, bookingUtils_1.initiatePayment)(data);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Okay",
        result: response === null || response === void 0 ? void 0 : response.payment_url,
    });
}));
exports.PaymentController = {
    initializePayment,
    confirmPayment,
};

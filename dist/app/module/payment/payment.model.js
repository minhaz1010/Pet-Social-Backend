"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const PaymentSchema = new mongoose_1.Schema({
    userMongodbId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    userId: {
        type: String,
        required: true,
    },
    month: {
        type: Number,
        enum: [1, 3, 6],
        required: true,
    },
    price: {
        type: Number,
        enum: [200, 500, 1000],
        required: true,
    },
    status: {
        type: String,
        enum: ["PAID", "FAILED"],
        default: "FAILED",
    },
    startedSubScriptionAt: {
        type: String,
    },
    endSubScriptionAt: {
        type: String,
    },
});
exports.Payment = (0, mongoose_1.model)("Payment", PaymentSchema);

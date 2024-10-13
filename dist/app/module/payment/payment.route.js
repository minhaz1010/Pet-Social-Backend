"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRouter = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const router = express_1.default.Router();
router.post("/", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), payment_controller_1.PaymentController.initializePayment);
router.post("/confirmation", payment_controller_1.PaymentController.confirmPayment);
router.get("/all-payment", payment_controller_1.PaymentController.getAllPayment);
exports.PaymentRouter = router;

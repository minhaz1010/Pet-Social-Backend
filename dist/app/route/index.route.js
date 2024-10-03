"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexRouter = void 0;
const express_1 = __importDefault(require("express"));
const post_route_1 = require("../module/post/post.route");
const payment_route_1 = require("../module/payment/payment.route");
const user_route_1 = require("../module/user/user.route");
const router = express_1.default.Router();
const modularRouter = [
    {
        path: "/posts",
        route: post_route_1.PostRouter,
    },
    {
        path: "/payment",
        route: payment_route_1.PaymentRouter,
    },
    {
        path: "/users",
        route: user_route_1.UserRouter,
    },
];
modularRouter.forEach((route) => router.use(route.path, route.route));
exports.IndexRouter = router;

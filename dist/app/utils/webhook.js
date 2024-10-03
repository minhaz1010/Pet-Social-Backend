"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyWebhook = void 0;
const svix_1 = require("svix");
const config_1 = __importDefault(require("../config"));
const verifyWebhook = (req) => {
    const WEBHOOK_SECRET = config_1.default.CLERK_WEBHOOK_SECRET_KEY;
    if (!WEBHOOK_SECRET) {
        throw new Error("You need a WEBHOOK_SECRET in your .env");
    }
    const headers = req.headers;
    const payload = req.body;
    const svix_id = headers["svix-id"];
    const svix_timestamp = headers["svix-timestamp"];
    const svix_signature = headers["svix-signature"];
    if (!svix_id || !svix_timestamp || !svix_signature) {
        throw new Error("Error occurred -- missing svix headers");
    }
    const svixHeaders = {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
    };
    const wh = new svix_1.Webhook(WEBHOOK_SECRET);
    try {
        const evt = wh.verify(payload, svixHeaders);
        return evt;
    }
    catch (err) {
        throw new Error(`Webhook failed to verify. Error: ${err.message}`);
    }
};
exports.verifyWebhook = verifyWebhook;

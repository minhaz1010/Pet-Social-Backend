import { Webhook, WebhookRequiredHeaders } from "svix";
import config from "../config";
import { Request } from "express";
import { WebhookEvent } from "@clerk/clerk-sdk-node";

export const verifyWebhook = (req: Request): WebhookEvent => {
  const WEBHOOK_SECRET = config.CLERK_WEBHOOK_SECRET_KEY;

  if (!WEBHOOK_SECRET) {
    throw new Error("You need a WEBHOOK_SECRET in your .env");
  }

  const headers = req.headers;
  const payload = req.body;

  const svix_id = headers["svix-id"] as string;
  const svix_timestamp = headers["svix-timestamp"] as string;
  const svix_signature = headers["svix-signature"] as string;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    throw new Error("Error occurred -- missing svix headers");
  }

  const svixHeaders: WebhookRequiredHeaders = {
    "svix-id": svix_id,
    "svix-timestamp": svix_timestamp,
    "svix-signature": svix_signature,
  };

  const wh = new Webhook(WEBHOOK_SECRET);

  try {
    const evt = wh.verify(payload, svixHeaders) as WebhookEvent;
    return evt;
  } catch (err) {
    throw new Error(
      `Webhook failed to verify. Error: ${(err as Error).message}`,
    );
  }
};

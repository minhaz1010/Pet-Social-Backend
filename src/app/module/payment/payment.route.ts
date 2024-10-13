import e from "express";
import { PaymentController } from "./payment.controller";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = e.Router();

router.post(
  "/",
  ClerkExpressRequireAuth(),
  PaymentController.initializePayment,
);
router.post("/confirmation", PaymentController.confirmPayment);

router.get("/all-payment", PaymentController.getAllPayment);

export const PaymentRouter = router;

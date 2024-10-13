import { model, Schema } from "mongoose";
import { IPayment } from "./payment.interface";

const PaymentSchema = new Schema<IPayment>({
  userMongodbId: {
    type: Schema.Types.ObjectId,
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

export const Payment = model<IPayment>("Payment", PaymentSchema);

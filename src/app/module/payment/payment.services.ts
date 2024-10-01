import path from "path";
import { User } from "../user/user.model";
import { readFileSync } from "fs";
import mongoose from "mongoose";
import AppError from "../../errors/appError";
import httpStatus from "http-status";
import { Payment } from "./payment.model";
import { IPayment } from "./payment.interface";
import { formattedDate } from "../../utils/formattedDate";

const confirmPaymentServices = async (
  trxId: string,
  userId: string,
  month: string,
) => {
  const filePath = path.join(__dirname, "../../../../public/confirmation.html");
  let template = readFileSync(filePath, "utf-8");
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const user = await User.findOneAndUpdate(
      { userId: userId },
      { membership: "PREMIUM" },
      { new: true, session },
    );
    if (!user) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Could Not Update User Membership",
      );
    }
    let price;
    let currentTimes;
    let endTimes;
    if (month === "1") {
      price = 200;
      const { currentTime, endTime } = formattedDate(30);
      currentTimes = currentTime;
      endTimes = endTime;
    }
    if (month === "3") {
      price = 500;
      const { currentTime, endTime } = formattedDate(90);
      currentTimes = currentTime;
      endTimes = endTime;
    }
    if (month === "6") {
      price = 1000;
      const { currentTime, endTime } = formattedDate(180);
      currentTimes = currentTime;
      endTimes = endTime;
    }

    const paymentOptions: IPayment = {
      userId: userId,
      price: price as 200 | 500 | 1000,
      month: Number(month) as 1 | 3 | 6,
      status: "PAID",
      startedSubScriptionAt: currentTimes,
      endSubScriptionAt: endTimes,
    };

    const paymentResult = await Payment.create([paymentOptions], { session });
    if (paymentResult.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, "Could Not Update Payment");
    }
    await session.commitTransaction();
    await session.endSession();
    template = template.replace("{transactionId}", trxId);
    return template;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Something went wrong mama");
  }
};

export const PaymentServices = {
  confirmPaymentServices,
};

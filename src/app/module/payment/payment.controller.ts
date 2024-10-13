import { readFileSync } from "fs";
import path from "path";
import {
  initiatePayment,
  TSendinfo,
  verifyPayment,
} from "../../utils/bookingUtils";
import catchAsyncErrors from "../../utils/catchAsyncError";
import sendResponse from "../../utils/sendResponse";
import { PaymentServices } from "./payment.services";

const confirmPayment = catchAsyncErrors(async (req, res) => {
  const { transactionId, userId, month } = req.query;
  const response = await verifyPayment(transactionId as string);
  const filePath = path.join(__dirname, "../../../../public/fail.html");
  const template = readFileSync(filePath, "utf-8");
  try {
    if (response.pay_status === "Successful") {
      const result = await PaymentServices.confirmPaymentServices(
        transactionId as string,
        userId as string,
        month as string,
      );
      res.send(result);
    } else {
      res.send(template);
    }
  } catch (error) {
    res.send(template);
  }
});

const initializePayment = catchAsyncErrors(async (req, res) => {
  const name = req.auth.sessionClaims?.name as string;
  const email = req.auth.sessionClaims?.email as string;
  // address ,phone and totalPrice ,month,
  const address = req.body.address;
  const phone = req.body.phone;
  const totalPrice = req.body.totalPrice;
  const time = String(Date.now());
  const data: TSendinfo = {
    month: req.body.month,
    userId: req.auth.userId as string,
    customerName: name,
    customerAddress: address,
    customerEmail: email,
    customerPhone: phone,
    totalPrice: totalPrice,
    transactionId: time,
  };
  const response = await initiatePayment(data);
  // console.log(response,'response')
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Okay",
    result: response?.payment_url,
  });
});

export const getAllPayment = catchAsyncErrors(async (req, res) => {
  const result = await PaymentServices.getAllPayment();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get All payment info",
    result,
  });
});

export const PaymentController = {
  initializePayment,
  confirmPayment,
  getAllPayment,
};

import config from "../config";
import axios from "axios";

export type TSendinfo = {
  userId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerPhone: string;
  totalPrice: number;
  transactionId: string;
};
export const initiatePayment = async (paymentData: TSendinfo) => {
  try {
    const response = await axios.post(config.AMARPAY_API!, {
      store_id: config.STORE_ID,
      signature_key: config.SIGNATURE_KEY,
      tran_id: paymentData.transactionId,
      success_url: `${config.BACKEND_URL}/api/v1/payment/confirmation?transactionId=${paymentData.transactionId}&userId=${paymentData.userId}&status=success`,
      fail_url: `${config.BACKEND_URL}/api/v1/payment/confirmation?status=failed`,
      cancel_url: "https://bike-rental-client-theta.vercel.app/",
      amount: paymentData.totalPrice,
      currency: "BDT",
      desc: "Merchant Registration Payment",
      cus_name: paymentData.customerName,
      cus_email: paymentData.customerEmail,
      cus_add1: paymentData.customerAddress,
      cus_add2: "N/A",
      cus_city: "N/A",
      cus_state: "N/A",
      cus_postcode: "N/A",
      cus_country: "N/A",
      cus_phone: paymentData.customerPhone,
      type: "json",
    });

    // * i will get payment url from response.data
    return response.data;
  } catch (err) {
    throw new Error("Payment initiation failed!");
  }
};

export const verifyPayment = async (tnxId: string) => {
  try {
    const response = await axios.get(config.PAYMENT_VERIFY_URL!, {
      params: {
        store_id: config.STORE_ID,
        signature_key: config.SIGNATURE_KEY,
        type: "json",
        request_id: tnxId,
      },
    });
    return response.data;
  } catch (err) {
    throw new Error("Payment validation failed!");
  }
};

import { Types } from "mongoose";

export type TStatus = "PAID" | "FAILED";
export interface IPayment {
  userMongodbId: Types.ObjectId;
  userId: string;
  month: 1 | 3 | 6;
  price: 200 | 500 | 1000;
  status: TStatus;
  startedSubScriptionAt?: string;
  endSubScriptionAt?: string;
}

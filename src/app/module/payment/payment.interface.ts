export type TStatus = "PAID" | "FAILED";
export interface IPayment {
  userId: string;
  month: 1 | 3 | 6;
  price: 200 | 500 | 1000;
  status: TStatus;
  startedSubScriptionAt?: string;
  endSubScriptionAt?: string;
}

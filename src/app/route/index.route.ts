import e from "express";
import { PostRouter } from "../module/post/post.route";
import { PaymentRouter } from "../module/payment/payment.route";
import { UserRouter } from "../module/user/user.route";

const router = e.Router();

const modularRouter = [
  {
    path: "/posts",
    route: PostRouter,
  },
  {
    path: "/payment",
    route: PaymentRouter,
  },
  {
    path: "/users",
    route: UserRouter,
  },
];

modularRouter.forEach((route) => router.use(route.path, route.route));

export const IndexRouter = router;

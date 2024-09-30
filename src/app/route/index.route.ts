import e from "express";
import { PostRouter } from "../module/post/post.route";

const router = e.Router();

const modularRouter = [
  {
    path: "/posts",
    route: PostRouter,
  },
];

modularRouter.forEach((route) => router.use(route.path, route.route));

export const IndexRouter = router;

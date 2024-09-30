import e from "express";
import { UserController } from "./user.controller";
const router = e.Router();

router.get("/", UserController.getAllUserFromDatabase);
export const UserRouter = router;

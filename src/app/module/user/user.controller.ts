/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import catchAsyncErrors from "../../utils/catchAsyncError";
import { UserJSON } from "@clerk/clerk-sdk-node";
import { UserServices } from "./user.services";
import { verifyWebhook } from "../../utils/webhook";
import AppError from "../../errors/appError";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { send } from "process";

const createUpdateDeleteController = catchAsyncErrors(
  async function (req, res) {
    let evt;

    try {
      evt = verifyWebhook(req);
    } catch (err) {
      console.log("Webhook failed to verify. Error:", (err as Error).message);
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Something went wrong in webhook",
      );
    }

    const { ...attr } = evt.data as UserJSON;
    const eventType = evt.type;

    if (eventType === "user.created") {
      await UserServices.createUserInDatabaseFromClerk(attr);
    }
    if (eventType === "user.updated") {
      await UserServices.updateUserInDatabaseFromClerk(attr);
    }
    if (eventType === "user.deleted") {
      await UserServices.deleteUserInDatabaseFromClerk(attr);
    }
  },
);

const getAllUserFromDatabase = catchAsyncErrors(async (req, res) => {
  const result = await UserServices.getAllUserFromDatabase();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    result,
    success: true,
    message: "Successfully Retrieved All Users",
  });
});

const getAUserDetails = catchAsyncErrors(async (req, res) => {
  // const userId = req.auth.userId;
  const userId = "user_2mn8oOL0b8rXSChtbd0sDfibfHs";
  const result = await UserServices.getAUserDetails(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Successfully Get the user",
    success: true,
    result,
  });
});
const followUser = catchAsyncErrors(async (req, res) => {
  const result = await UserServices.followUser(
    req.params.followerId,
    req.body.userId,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Followed Successfully",
    result,
  });
});

const unfollowUser = catchAsyncErrors(async (req, res) => {
  const result = await UserServices.unfollowUser(
    req.params.followerId,
    req.body.userId,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Unfollowed Successfully",
    result,
  });
});

export const UserController = {
  createUpdateDeleteController,
  getAllUserFromDatabase,
  followUser,
  unfollowUser,
  getAUserDetails,
};

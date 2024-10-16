/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import catchAsyncErrors from "../../utils/catchAsyncError";
import { UserJSON } from "@clerk/clerk-sdk-node";
import { UserServices } from "./user.services";
import { verifyWebhook } from "../../utils/webhook";
import AppError from "../../errors/appError";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";

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
  const { sessionClaims } = req.auth;
  if (sessionClaims?.metadata.role !== "ADMIN") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Sorry you have no access to this route",
    );
  }
  const result = await UserServices.getAllUserFromDatabase();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    result,
    success: true,
    message: "Successfully Retrieved All Users",
  });
});

const getAUserDetails = catchAsyncErrors(async (req, res) => {
  const userId = req.auth.userId as string;
  const result = await UserServices.getAUserDetails(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Successfully Get the user",
    success: true,
    result,
  });
});

const getAUserDetailsByUserName = catchAsyncErrors(async (req, res) => {
  const userName = req.params.userName;
  const result = await UserServices.getAUserDetailsByUserName(userName);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Successfully Get the user details",
    success: true,
    result,
  });
});

const followUser = catchAsyncErrors(async (req, res) => {
  const userId = req.auth.userId as string;
  // console.log(userId,'userId');
  console.log(req.params.followerId);
  const result = await UserServices.followUser(req.params.followerId, userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Followed Successfully",
    result,
  });
});

const unfollowUser = catchAsyncErrors(async (req, res) => {
  const userId = req.auth.userId as string;
  // const userId = "user_2n8JsKyG5g4roI6D3zHissu8imU"
  const result = await UserServices.unfollowUser(req.params.followerId, userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Unfollowed Successfully",
    result,
  });
});

const changeRole = catchAsyncErrors(async (req, res) => {
  const { sessionClaims } = req.auth;
  if (sessionClaims?.metadata.role !== "ADMIN") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Sorry you have no access to this route",
    );
  }
  const result = await UserServices.changeRole(req.params.id, req.body.role);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Change role Successfully",
    result,
  });
});

export const deleteAUser = catchAsyncErrors(async (req, res) => {
  const { sessionClaims } = req.auth;
  if (sessionClaims?.metadata.role !== "ADMIN") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have no access to this route",
    );
  }
  const result = await UserServices.deleteAUserInDatabase(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Successfully deleted",
    result,
    success: true,
  });
});

export const UserController = {
  createUpdateDeleteController,
  getAllUserFromDatabase,
  followUser,
  unfollowUser,
  getAUserDetails,
  getAUserDetailsByUserName,
  changeRole,
  deleteAUser,
};

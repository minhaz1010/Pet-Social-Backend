import httpStatus from "http-status";
import AppError from "../errors/appError";
import catchAsyncErrors from "../utils/catchAsyncError";
import { v2 as cloudinary } from "cloudinary";

export const resizeImageOfPost = catchAsyncErrors(async (req, res, next) => {
  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, "There is no image");
  }
  const result = await cloudinary.uploader.upload(req.file.path, {
    transformation: [
      {
        width: 600,
        height: 600,
        crop: "limit",
        quality: "auto",
        fetch_format: "auto",
      },
    ],
    public_id: req.file.filename,
    overwrite: true,
  });

  req.file.path = result.secure_url;
  req.file.filename = result.public_id;
  next();
});

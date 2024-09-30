/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
});

export const mutlerUpload = multer({ storage });

import { Webhook, WebhookRequiredHeaders } from "svix";
import config from "../../config";
import catchAsyncErrors from "../../utils/catchAsyncError";
import { UserJSON, WebhookEvent } from "@clerk/clerk-sdk-node";
import { UserServices } from "./user.services";

// const resizeImage = async (req: Request, res: Response, next: NextFunction) => {
//   if (!req.file) {
//     return next();
//   }

//   try {
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       transformation: [
//         { width: 600, height: 600, crop: "limit",quality:"auto",fetch_format:"auto" }
//       ],
//       public_id: req.file.filename,
//       overwrite: true,
//     });

//     req.file.path = result.secure_url;
//     req.file.filename = result.public_id;
//     next();
//   } catch (error) {
//     next(error);
//   }
// };

const createController = catchAsyncErrors(async function (req, res) {
  const WEBHOOK_SECRET = config.CLERK_WEBHOOK_SECRET_KEY;
  if (!WEBHOOK_SECRET) {
    throw new Error("You need a WEBHOOK_SECRET in your .env");
  }

  const headers = req.headers;
  const payload = req.body;

  const svix_id = headers["svix-id"] as string;
  const svix_timestamp = headers["svix-timestamp"] as string;
  const svix_signature = headers["svix-signature"] as string;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({
      success: false,
      message: "Error occurred -- missing svix headers",
    });
  }

  const svixHeaders: WebhookRequiredHeaders = {
    "svix-id": svix_id,
    "svix-timestamp": svix_timestamp,
    "svix-signature": svix_signature,
  };

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, svixHeaders) as WebhookEvent;
  } catch (err) {
    console.log("Webhook failed to verify. Error:", (err as Error).message);
    return res.status(400).json({
      success: false,
      message: (err as Error).message,
    });
  }

  const { ...attr } = evt.data as UserJSON;
  const eventType = evt.type;

  if (eventType === "user.created") {
    if (attr) {
      const userId = attr.id;
      const userName = attr.username as string;
      const fullName = `${attr.first_name as string} ${attr.last_name as string}`;
      const email = attr.email_addresses[0].email_address;
      const imageURL = attr.image_url;

      const user = {
        userId,
        userName,
        fullName,
        email,
        imageURL,
      };
      await UserServices.createUserInDatabaseFromClerk(user);
    }
  }

  return res.status(200).json({
    success: true,
    message: "Webhook received",
  });
});

export const UserController = {
  createController,
};

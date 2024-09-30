import { clerkClient, UserJSON } from "@clerk/clerk-sdk-node";
import { User } from "./user.model";

const createUserInDatabaseFromClerk = async (payload: UserJSON) => {
  if (payload) {
    const userId = payload.id;
    const userName = payload.username as string;
    const fullName = `${payload.first_name as string} ${payload.last_name as string}`;
    const email = payload.email_addresses[0].email_address;
    const imageURL = payload.image_url;
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { role: "USER" },
    });
    const user = {
      userId,
      userName,
      fullName,
      email,
      imageURL,
    };
    await User.create(user);
  }
};

const updateUserInDatabaseFromClerk = async (payload: UserJSON) => {
  if (payload) {
    const userId = payload.id;
    const userName = payload.username as string;
    const fullName = `${payload.first_name as string} ${payload.last_name as string}`;
    const email = payload.email_addresses[0].email_address;
    const imageURL = payload.image_url;
    const user = {
      userId,
      userName,
      fullName,
      email,
      imageURL,
    };
    await User.findOneAndUpdate({ userId }, user, { new: true });
  }
};

const deleteUserInDatabaseFromClerk = async (payload: UserJSON) => {
  if (payload) {
    const userId = payload.id;
    await User.findOneAndDelete({ userId });
  }
};

const getAllUserFromDatabase = async () => {
  const result = await User.find();
  return result;
};

export const UserServices = {
  createUserInDatabaseFromClerk,
  updateUserInDatabaseFromClerk,
  deleteUserInDatabaseFromClerk,
  getAllUserFromDatabase,
};

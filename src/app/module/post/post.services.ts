import { IPost } from "./post.interface";
import { Post } from "./post.model";

const createPostInDatabase = async (
  payload: Partial<IPost>,
  imageUrl: string,
) => {
  const post = {
    ...payload,
    imageURL: imageUrl,
  };

  const result = await Post.create(post);
  return result;
};

export const PostServices = {
  createPostInDatabase,
};

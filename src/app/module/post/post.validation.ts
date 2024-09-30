import z from "zod";

const createPostValidation = z.object({
  body: z.object({
    title: z.string(),
    petType: z.string(),
    content: z.string(),
    postType: z.enum(["TIP", "STORY"]),
    author: z.string(),
    isPremium: z.boolean().optional(),
  }),
});

const updatePostValidation = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    petType: z.string().optional(),
    imageURL: z.string().url().optional(),
    postType: z.enum(["TIP", "STORY"]).optional(),
    isPremium: z.boolean().optional(),
    likes: z.number().optional(),
    dislikes: z.number().optional(),
  }),
});

export const PostValidation = {
  createPostValidation,
  updatePostValidation,
};

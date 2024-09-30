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

export const PostValidation = {
  createPostValidation,
};

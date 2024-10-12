import z from "zod";

const createPostValidation = z.object({
  body: z.object({
    title: z.string(),
    petType: z.string(),
    content: z.string(),
    postType: z.enum(["TIP", "STORY"]),
    author: z.string(),
    isPremium: z.boolean().optional(),
    image: z
      .array(
        z.object({
          public_id: z.string().min(1, "Public ID is required"),
          secure_url: z.string().url("Invalid URL format"),
        }),
      )
      .optional(),
  }),
});

const updatePostValidation = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    petType: z.string().optional(),
    image: z.string().url().optional(),
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

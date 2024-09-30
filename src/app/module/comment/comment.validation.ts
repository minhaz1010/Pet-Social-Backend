import z from "zod";

const createCommentValidation = z.object({
  body: z.object({
    content: z.string(),
    author: z.string(),
    post: z.string(),
  }),
});

const updateCommentValidation = z.object({
  body: z.object({
    content: z.string().optional(),
    author: z.string().optional(),
    post: z.string().optional(),
    likes: z.number().optional(),
    dislikes: z.number().optional(),
  }),
});

export const CommentValidation = {
  createCommentValidation,
  updateCommentValidation,
};

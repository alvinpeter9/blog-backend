import z from "zod";
import { postUUIDSchema } from "../validators/post.validators.js";

export const commentUUIDSchema = z.uuid("Comment ID must be valid");

export const commentIDSchema = z.object({
  commentId: commentUUIDSchema,
});

export const deleteCommentSchema = z.object({
  commentId: commentUUIDSchema,
  postAuthorId: postUUIDSchema,
});

export const getCommentsByPostIDSchema = z.object({
  postId: postUUIDSchema,
});

export const createCommentSchema = z.object({
  postId: z.uuid("Post ID must be valid"),
  userName: z
    .string({ error: "UserName is required" })
    .min(1, "UserName cannot be empty"),
  content: z
    .string({ error: "Content is required" })
    .min(1, "Content cannot be empty"),
});

export const commentSchema = z.object({
  id: commentUUIDSchema,
  postId: postUUIDSchema,
  userName: z
    .string({ error: "UserName is required" })
    .min(1, "UserName cannot be empty"),
  content: z
    .string({ error: "Content is required" })
    .min(1, "Content cannot be empty"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

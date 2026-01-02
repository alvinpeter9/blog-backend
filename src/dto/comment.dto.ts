import z from "zod";
import { postUUIDSchema } from "../validators/post.validators.js";
import {
  commentSchema,
  createCommentSchema,
  deleteCommentSchema,
} from "../validators/comment.validators.js";

export type GetCommentsByPostIdRequestDto = z.infer<typeof postUUIDSchema>;
export type CommentResponseDto = z.infer<typeof commentSchema>;
export type CreateCommentRequestDto = z.infer<typeof createCommentSchema>;
export type DeleteCommentRequestDto = z.infer<typeof deleteCommentSchema>;

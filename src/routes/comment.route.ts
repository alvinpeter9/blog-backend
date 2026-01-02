import { Router } from "express";
import { CommentService } from "../services/comment.service.js";
import { CommentController } from "../controller/comment.controller.js";
import { validate } from "../middleware/validate.js";
import {
  createCommentSchema,
  deleteCommentSchema,
  getCommentsByPostIDSchema,
} from "../validators/comment.validators.js";
import { authenticate, apiRateLimiter } from "../middleware/index.js";

const router = Router();
const commentService = new CommentService();
const commentController = new CommentController(commentService);

router.post(
  "/",
  apiRateLimiter(20),
  validate(createCommentSchema),
  commentController.createComment
);

router.get(
  "/:postId",
  validate(getCommentsByPostIDSchema, "params"),
  commentController.getCommentsByPostId
);

router.delete(
  "/:commentId",
  apiRateLimiter(10),
  authenticate,
  validate(deleteCommentSchema.omit({ postAuthorId: true })),
  commentController.deleteComment
);

export default router;

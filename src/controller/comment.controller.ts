import { NextFunction, Request, Response } from "express";
import { CommentService } from "../services/comment.service.js";

export class CommentController {
  constructor(private commentService: CommentService) {}

  getCommentsByPostId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { postId } = req.params;
      const comments = await this.commentService.getCommentsByPostId(postId);
      res.json({
        success: true,
        data: comments,
      });
    } catch (error) {
      next(error);
    }
  };

  createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const commentData = req.body;
      const comment = await this.commentService.createComment(commentData);
      res.status(201).json({
        success: true,
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { commentId } = req.params;
      await this.commentService.deleteComment({
        commentId,
        postAuthorId: userId,
      });
      res.json({
        success: true,
        message: "Comment deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

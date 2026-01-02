import { prisma } from "../config/database.js";
import {
  CommentResponseDto,
  CreateCommentRequestDto,
  DeleteCommentRequestDto,
  GetCommentsByPostIdRequestDto,
} from "../dto/comment.dto.js";
import { AppError } from "../utils/app-error.js";

export class CommentService {
  async getCommentsByPostId(
    postId: GetCommentsByPostIdRequestDto
  ): Promise<CommentResponseDto[]> {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
    });

    if (!comments || comments.length === 0) {
      throw new Error("No comments found for this post");
    }

    return comments;
  }

  async createComment(
    data: CreateCommentRequestDto
  ): Promise<CommentResponseDto> {
    const comment = await prisma.comment.create({
      data,
    });

    return comment;
  }

  async deleteComment(data: DeleteCommentRequestDto): Promise<void> {
    const { commentId, postAuthorId } = data;
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        post: {
          select: {
            authorId: true,
          },
        },
      },
    });

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    if (comment.post.authorId !== postAuthorId) {
      throw new AppError("Not authorized to delete this comment", 403);
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });
  }
}

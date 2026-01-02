import { NextFunction, Request, Response } from "express";
import { PostService } from "../services/post.service.js";

export class PostController {
  constructor(private postService: PostService) {}

  getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filters, cursor, pagesize } = req.validatedQuery || {};

      const result = await this.postService.getAllPosts({
        filters: filters ? JSON.parse(filters as string) : undefined,
        cursor: cursor as string,
        pageSize: pagesize as string,
      });
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getPostById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { postId } = req.params;
      const result = await this.postService.getPostById(postId);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getPostsByCategoryId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { categoryId } = req.params;
      const posts = await this.postService.getPostsByCategoryId(categoryId);
      res.json({
        success: true,
        data: posts,
      });
    } catch (error) {
      next(error);
    }
  };

  createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const postData = req.body;
      const result = await this.postService.createPost({
        ...postData,
        authorId: userId,
      });
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  updatePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { postId } = req.params;
      const postData = req.body;
      const result = await this.postService.updatePost({
        ...postData,
        postId,
        authorId: userId,
      });
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { postId } = req.body;
      await this.postService.deletePost({ postId, authorId: userId });
      res.json({
        success: true,
        message: "Post deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

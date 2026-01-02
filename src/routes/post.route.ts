import { Router } from "express";
import { PostController } from "../controller/post.controller.js";
import { PostService } from "../services/post.service.js";
import { validate } from "../middleware/validate.js";
import {
  createPostSchema,
  deletePostSchema,
  getAllPostsSchema,
  postIDSchema,
  updatePostSchema,
} from "../validators/post.validators.js";
import { authenticate, apiRateLimiter } from "../middleware/index.js";
import { categoryIDSchema } from "../validators/category.validators.js";

const router = Router();
const postService = new PostService();
const postController = new PostController(postService);

router.get(
  "/",
  validate(getAllPostsSchema, "query"),
  postController.getAllPosts
);

router.get(
  "/:postId",
  validate(postIDSchema, "params"),
  postController.getPostById
);

router.get(
  "/category/:categoryId",
  validate(categoryIDSchema, "params"),
  postController.getPostsByCategoryId
);

router.post(
  "/",
  apiRateLimiter(30),
  authenticate,
  validate(createPostSchema),
  postController.createPost
);

router.put(
  "/:postId",
  apiRateLimiter(30),
  authenticate,
  validate(postIDSchema, "params"),
  validate(updatePostSchema.omit({ postId: true, authorId: true })),
  postController.updatePost
);

router.delete(
  "/:postId",
  apiRateLimiter(20),
  authenticate,
  validate(deletePostSchema.omit({ authorId: true })),
  postController.deletePost
);

export default router;

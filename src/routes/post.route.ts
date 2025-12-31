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
} from "../validators/post.validator.js";

const router = Router();
const postService = new PostService();
const postController = new PostController(postService);

router.get(
  "/",
  validate(getAllPostsSchema, "query"),
  postController.getAllPosts
);

router.post("/", validate(createPostSchema), postController.createPost); // create new post

router.get(
  "/:postId",
  validate(postIDSchema, "params"),
  postController.getPostById
);

router.put(
  "/:postId",
  validate(postIDSchema, "params"),
  validate(updatePostSchema.omit({ postId: true })),
  postController.updatePost
);

router.delete(
  "/:postId",
  validate(deletePostSchema),
  postController.deletePost
);

export default router;

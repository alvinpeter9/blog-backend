import z from "zod";
import {
  createPostSchema,
  deletePostSchema,
  getAllPostsSchema,
  postUUIDSchema,
  updatePostSchema,
} from "../validators/post.validators.js";

export type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  categoryId: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type Author = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type Category = {
  id: string;
  name: string;
};

export interface PostResponseDto {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PostWithAuthorAndCategory
  extends Omit<PostResponseDto, "authorId" | "categoryId"> {
  author: Author;
  category: Category;
}

export type GetAllPostRequestDto = z.infer<typeof getAllPostsSchema>;
export interface GetAllPostResponseDto {
  posts: PostWithAuthorAndCategory[];
  nextCursor: string | null;
}

export type GetPostRequestDto = z.infer<typeof postUUIDSchema>;
export type GetPostResponseDto = PostWithAuthorAndCategory;

export type UpdatePostRequestDto = z.infer<typeof updatePostSchema>;

export type CreatePostRequestDto = z.infer<typeof createPostSchema>;

export type DeletePostRequestDto = z.infer<typeof deletePostSchema>;

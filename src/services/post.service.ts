import { prisma } from "../config/database.js";
import { Prisma } from "../config/generated/browser.js";
import {
  CreatePostRequestDto,
  DeletePostRequestDto,
  GetAllPostRequestDto,
  GetAllPostResponseDto,
  GetPostRequestDto,
  GetPostResponseDto,
  PostResponseDto,
  UpdatePostRequestDto,
} from "../dto/post.dto.js";
import { AppError } from "../utils/app-error.js";

export class PostService {
  private static readonly DEFAULT_POST_SIZE = 10;
  private static readonly MAX_POST_SIZE = 50;

  async getAllPosts({
    filters,
    cursor,
    pageSize,
  }: GetAllPostRequestDto): Promise<GetAllPostResponseDto> {
    const size = Math.min(
      Math.max(Number(pageSize) || PostService.DEFAULT_POST_SIZE, 1),
      PostService.MAX_POST_SIZE
    );

    const where: Prisma.PostWhereInput = {
      ...(filters?.published !== undefined && {
        published: filters.published,
      }),
      ...(filters?.authorId && {
        authorId: filters.authorId,
      }),
      ...(filters?.categoryId && {
        categoryId: filters.categoryId,
      }),
      ...(filters?.search && {
        OR: [
          { title: { contains: filters.search, mode: "insensitive" } },
          { content: { contains: filters.search, mode: "insensitive" } },
        ],
      }),
    };

    const postData = await prisma.post.findMany({
      where,
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: size + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: 0,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });

    if (!postData || postData.length === 0) {
      throw new AppError("No posts found", 404);
    }

    const hasNextPage = postData.length > size;

    return {
      posts: hasNextPage ? postData.slice(0, size) : postData,
      nextCursor: hasNextPage ? postData[size].id : null,
    };
  }

  async getPostById(postId: GetPostRequestDto): Promise<GetPostResponseDto> {
    if (!postId) {
      throw new AppError("Post ID is required", 400);
    }
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!post) {
      throw new AppError("Post not found", 404);
    }
    return post;
  }

  async createPost(postData: CreatePostRequestDto): Promise<PostResponseDto> {
    const user = await prisma.user.findUnique({
      where: { id: postData.authorId },
    });

    if (!user) {
      throw new AppError("Not authorized to create post", 403);
    }

    const newPost = await prisma.post.create({
      data: {
        ...postData,
        authorId: user.id,
      },
    });
    return newPost;
  }

  async updatePost(postData: UpdatePostRequestDto): Promise<PostResponseDto> {
    const { postId, authorId, ...updateData } = postData;

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    if (post.authorId !== authorId) {
      throw new AppError("Not authorized to update this post", 403);
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: updateData,
    });
    return updatedPost;
  }

  async deletePost(postData: DeletePostRequestDto): Promise<void> {
    const post = await prisma.post.findUnique({
      where: { id: postData.postId },
    });
    if (!post) {
      throw new AppError("Post not found", 404);
    }
    if (post.authorId !== postData.authorId) {
      throw new AppError("Not authorized to delete this post", 403);
    }
    await prisma.post.delete({
      where: { id: post.id },
    });
  }
}

import z from "zod";

const categoryIdSchema = z.uuid("Category ID must be valid");
const authorIdSchema = z.uuid("Author ID must be valid");
export const postUUIDSchema = z.uuid("Post ID must be valid");

export const postIDSchema = z.object({
  postId: postUUIDSchema,
});

export const deletePostSchema = z.object({
  authorId: authorIdSchema,
  postId: postUUIDSchema,
});

export const postSchema = z.object({
  postId: postUUIDSchema,
  title: z
    .string({ error: "Title is required" })
    .min(1, "Title cannot be empty")
    .max(255, "Title cannot exceed 255 characters"),
  content: z
    .string({ error: "Content is required" })
    .min(1, "Content cannot be empty"),
  published: z.boolean({ error: "Published status is required" }),
  categoryId: categoryIdSchema,
  authorId: authorIdSchema,
});

export const getAllPostsFiltersSchema = z.object({
  published: z
    .enum(["true", "false"], { error: "Published must be 'true' or 'false'" })
    .transform((v) => v === "true")
    .optional(),
  authorId: authorIdSchema.optional(),
  categoryId: categoryIdSchema.optional(),
  search: z.string().min(1, "Search cannot be empty").optional(),
});

export const getAllPostsSchema = z.object({
  cursor: z.uuid().optional(),
  pageSize: z
    .string()
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num > 0 && num <= 50;
      },
      { message: "Page size must be a number between 1 and 50" }
    )
    .optional(),
  filters: getAllPostsFiltersSchema.optional(),
});

export const createPostSchema = postSchema.omit({ postId: true });

export const updatePostSchema = postSchema.partial().extend({
  postId: postUUIDSchema,
  authorId: authorIdSchema,
});

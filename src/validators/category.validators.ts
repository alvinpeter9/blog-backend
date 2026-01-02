import z from "zod";

export const categoryUUIDSchema = z.uuid("Category ID must be valid");

export const categoryIDSchema = z.object({
  categoryId: categoryUUIDSchema,
});

export const createCategorySchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .min(1, "Name cannot be empty")
    .max(100, "Name cannot exceed 100 characters"),
  description: z.string().max(500, "Description cannot exceed 500 characters"),
  imageUrl: z.url("Image URL must be a valid URL"),
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  categoryId: categoryUUIDSchema,
});

export const getAllCategoriesSchema = z.object({});
import z from "zod";
import {
  categoryUUIDSchema,
  createCategorySchema,
  updateCategorySchema,
} from "../validators/category.validators.js";

export type Category = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

interface CategoryWithPostCount extends Category {
  totalPosts: number;
}

export type GetAllCategoriesResponseDto = Array<CategoryWithPostCount>;

export type CreateCategoryRequestDto = z.infer<typeof createCategorySchema>;
export type UpdateCategoryRequestDto = z.infer<typeof updateCategorySchema>;
export type DeleteCategoryRequestDto = z.infer<typeof categoryUUIDSchema>;
export type GetCategoryRequestDto = z.infer<typeof categoryUUIDSchema>;


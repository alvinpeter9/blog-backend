import { prisma } from "../config/database.js";
import {
  Category,
  CreateCategoryRequestDto,
  DeleteCategoryRequestDto,
  GetAllCategoriesResponseDto,
  GetCategoryRequestDto,
  UpdateCategoryRequestDto,
} from "../dto/category.dto.js";
import { AppError } from "../utils/app-error.js";

export class CategoryService {
  async getAllCategories(): Promise<GetAllCategoriesResponseDto> {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        _count: {
          select: {
            posts: {
              where: { published: true },
            },
          },
        },
      },
    });

    if (!categories || categories.length === 0) {
      throw new AppError("No categories found", 404);
    }

    const result = categories.map(({ _count, ...category }) => ({
      ...category,
      totalPosts: _count.posts,
    }));

    return result;
  }

  async getCategoryById(categoryId: GetCategoryRequestDto): Promise<Category> {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
      },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return category;
  }

  async createCategory(
    updateData: CreateCategoryRequestDto
  ): Promise<Category> {
    const newCategory = await prisma.category.create({
      data: updateData,
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
      },
    });

    return newCategory;
  }

  async updateCategory(
    updateData: UpdateCategoryRequestDto
  ): Promise<Category> {
    const { categoryId, ...data } = updateData;
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    const updatedCategory = await prisma.category.update({
      where: { id: category.id },
      data,
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
      },
    });

    return updatedCategory;
  }

  async deleteCategory(categoryId: DeleteCategoryRequestDto): Promise<void> {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });
  }
}

import { NextFunction, Request, Response } from "express";
import { CategoryService } from "../services/category.service.js";

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  getAllCategories = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  };

  getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categoryId } = req.params;
      const category = await this.categoryService.getCategoryById(categoryId);
      res.json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };

  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const category = await this.categoryService.createCategory(data);
      res.status(201).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };

  updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categoryId } = req.params;
      const data = req.body;
      const category = await this.categoryService.updateCategory({
        categoryId,
        ...data,
      });
      res.json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categoryId } = req.params;
      await this.categoryService.deleteCategory(categoryId);
      res.json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

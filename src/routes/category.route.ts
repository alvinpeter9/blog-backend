import { Router } from "express";
import { CategoryService } from "../services/category.service.js";
import { CategoryController } from "../controller/category.controller.js";
import { validate } from "../middleware/validate.js";
import {
  categoryIDSchema,
  createCategorySchema,
  updateCategorySchema,
} from "../validators/category.validators.js";
import { authenticate, apiRateLimiter } from "../middleware/index.js";

const router = Router();
const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService);

router.get("/", categoryController.getAllCategories);

router.post(
  "/",
  apiRateLimiter(),
  authenticate,
  validate(createCategorySchema),
  categoryController.createCategory
);

router.get(
  "/:categoryId",
  validate(categoryIDSchema, "params"),
  categoryController.getCategoryById
);

router.put(
  "/:categoryId",
  apiRateLimiter(5),
  authenticate,
  validate(categoryIDSchema, "params"),
  validate(updateCategorySchema.omit({ categoryId: true })),
  categoryController.updateCategory
);

router.delete(
  "/:categoryId",
  apiRateLimiter(5),
  authenticate,
  validate(categoryIDSchema, "params"),
  categoryController.deleteCategory
);

export default router;

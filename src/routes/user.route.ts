import { Router } from "express";
import { validate } from "../middleware/validate.js";
import {
  getAllUsersSchema,
  updateUserSchema,
  userIDSchema,
} from "../validators/user.validators.js";
import { UserService } from "../services/user.service.js";
import { UserController } from "../controller/user.controller.js";
import { apiRateLimiter, authenticate } from "../middleware/index.js";

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

router.get(
  "/",
  authenticate,
  validate(getAllUsersSchema, "query"),
  userController.getAllUsers
);

router.get(
  "/:userId",
  authenticate,
  validate(userIDSchema, "params"),
  userController.getUserById
);

router.put(
  "/:userId",
  apiRateLimiter(5),
  authenticate,
  validate(userIDSchema, "params"),
  validate(updateUserSchema),
  userController.updateUser
);

router.delete(
  "/:userId",
  apiRateLimiter(5),
  authenticate,
  validate(userIDSchema, "params"),
  userController.deleteUser
);

export default router;

import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { AuthService } from "../services/auth.service.js";
import { AuthController } from "../controller/auth.controller.js";
import {
  forgotPasswordSchema,
  loginUserSchema,
  registerUserSchema,
  resetPasswordSchema,
} from "../validators/auth.validators.js";
import { authenticate, apiRateLimiter } from "../middleware/index.js";

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

router.post(
  "/register",
  apiRateLimiter(5),
  validate(registerUserSchema),
  authController.register
);

router.post(
  "/login",
  apiRateLimiter(),
  validate(loginUserSchema),
  authController.login
);

router.post(
  "/forgot-password",
  apiRateLimiter(5),
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  "/reset-password",
  apiRateLimiter(5),
  validate(resetPasswordSchema),
  authController.resetPassword
);

router.post("/refresh", apiRateLimiter(3), authController.refreshToken);

router.post("/logout", apiRateLimiter(5), authenticate, authController.logout);

router.get("/validate", apiRateLimiter(3), authController.validateToken);

export default router;

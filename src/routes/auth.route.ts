import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { AuthService } from "../services/auth.service.js";
import { AuthController } from "../controller/auth.controller.js";
import {
  forgotPasswordSchema,
  loginUserSchema,
  logoutSchema,
  refreshTokenSchema,
  registerUserSchema,
  resetPasswordSchema,
  validateTokenSchema,
} from "../validators/auth.validators.js";

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

router.post("/register", validate(registerUserSchema), authController.register);

router.post("/login", validate(loginUserSchema), authController.login);

router.post(
  "/refresh",
  validate(refreshTokenSchema),
  authController.refreshToken
);

router.post("/logout", validate(logoutSchema), authController.logout);

router.get(
  "/validate",
  validate(validateTokenSchema),
  authController.validateToken
);

router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword
);

export default router;

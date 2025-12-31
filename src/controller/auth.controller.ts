import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";
import {
  LoginUserRequestDto,
  RegisterUserRequestDto,
} from "../dto/auth.dto.js";
import { logger } from "../utils/logger.js";

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: RegisterUserRequestDto = req.body;
      const result = await this.authService.register(dto);

      logger.info("User registered successfully", { email: dto.email });

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: LoginUserRequestDto = req.body;
      const result = await this.authService.login(dto);

      logger.info("User logged in", { email: dto.email });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;

      const result = await this.authService.refreshToken(refreshToken);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      await this.authService.logout(refreshToken);

      res.json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  validateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      const payload = await this.authService.validateToken(token);

      return res.json({
        success: true,
        data: payload,
      });
    } catch (error) {
      return next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      await this.authService.forgotPassword(email);
      res.json({
        success: true,
        message: "Password reset email sent. Please check your inbox.",
      });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, newPassword } = req.body;
      await this.authService.resetPassword({ token, newPassword });
      res.json({
        success: true,
        message: "Password has been reset successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  // private setRefreshTokenCookie(res: Response, refreshToken: string) {
  //   const isProduction = config.ENV === "production";

  //   res.cookie("refreshToken", refreshToken, {
  //     httpOnly: true,
  //     secure: isProduction, // Only sent over HTTPS in production
  //     sameSite: "strict",
  //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  //     path: "/", // Available on all routes
  //     domain: "localhost", // Your domain
  //   });
  // }

  // private clearRefreshTokenCookie(res: Response) {
  //   res.clearCookie("refreshToken", {
  //     httpOnly: true,
  //     secure: config.ENV === "production",
  //     sameSite: "strict",
  //     path: "/",
  //     domain: "localhost",
  //   });
  // }
}

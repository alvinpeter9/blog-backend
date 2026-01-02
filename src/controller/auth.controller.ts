import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";
import {
  LoginUserRequestDto,
  RegisterUserRequestDto,
} from "../dto/auth.dto.js";
import { logger } from "../utils/logger.js";
import { config } from "../config/index.js";

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: RegisterUserRequestDto = req.body;
      const { user, accessToken, refreshToken } =
        await this.authService.register(dto);

      logger.info("User registered successfully", { email: dto.email });

      this.setTokenCookie(res, refreshToken, "refresh");
      this.setTokenCookie(res, accessToken, "access");

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: LoginUserRequestDto = req.body;
      const { user, accessToken, refreshToken } = await this.authService.login(
        dto
      );

      logger.info("User logged in", { email: dto.email });

      this.setTokenCookie(res, refreshToken, "refresh");
      this.setTokenCookie(res, accessToken, "access");

      res.json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies?.refreshToken as string;

      const { accessToken, refreshToken: newRefreshToken } =
        await this.authService.refreshToken(refreshToken);

      this.setTokenCookie(res, accessToken, "access");
      this.setTokenCookie(res, newRefreshToken, "refresh");

      res.json({
        success: true,
        message: "Token refreshed successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies?.refreshToken as string;
      await this.authService.logout(refreshToken);

      this.clearTokenCookie(res);

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
      const token = req.cookies?.accessToken as string;
      const payload = await this.authService.validateToken(token);

      res.json({
        success: true,
        data: payload,
      });
    } catch (error) {
      this.clearTokenCookie(res);
      next(error);
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

  private setTokenCookie(
    res: Response,
    token: string,
    tokenType: "access" | "refresh"
  ) {
    const isProduction = config.ENV === "production";
    const isAccessToken = tokenType === "access";

    res.cookie(isAccessToken ? "accessToken" : "refreshToken", token, {
      httpOnly: true,
      secure: isProduction, // Only sent over HTTPS in production
      sameSite: "strict",
      maxAge: isAccessToken
        ? 15 * 60 * 1000 // 15 minutes
        : 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/", // Available on all routes
    });
  }

  private clearTokenCookie(res: Response) {
    const options = {
      httpOnly: true,
      secure: config.ENV === "production",
      sameSite: "strict" as const,
      path: "/",
    };
    res.clearCookie("refreshToken", options);
    res.clearCookie("accessToken", options);
  }
}

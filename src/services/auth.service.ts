import { prisma } from "../config/database.js";
import { config } from "../config/index.js";
import { redis } from "../config/redis.js";
import {
  AuthResponseDto,
  ForgotPasswordRequestDto,
  JwtTokenResponseDto,
  LoginUserRequestDto,
  LogoutTokenRequestDto,
  RefreshTokenRequestDto,
  RegisterUserRequestDto,
  ResetPasswordRequestDto,
  ValidateTokenRequestDto,
  ValidateTokenResponseDto,
} from "../dto/auth.dto.js";
import { AppError } from "../utils/app-error.js";
import { logger } from "../utils/logger.js";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";

export class AuthService {
  async register(authData: RegisterUserRequestDto): Promise<AuthResponseDto> {
    const existingUser = await prisma.user.findUnique({
      where: { email: authData.email },
    });

    if (existingUser) {
      throw new AppError("User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(
      authData.password,
      config.BCRYPT_ROUNDS
    );

    const user = await prisma.user.create({
      data: {
        email: authData.email,
        password: hashedPassword,
        firstName: authData.firstName,
        lastName: authData.lastName,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      ...tokens,
    };
  }

  async login(dto: LoginUserRequestDto): Promise<AuthResponseDto> {
    const user = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new AppError("Invalid Email", 401);
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.password);

    if (!isValidPassword) {
      throw new AppError("Invalid Password", 401);
    }

    const tokens = await this.generateTokens(user.id, user.email);

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      ...tokens,
    };
  }

  async forgotPassword(email: ForgotPasswordRequestDto): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    // Generate a password reset token and send it via email
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    await redis.set(`password_reset:${hashedToken}`, user.id, "EX", 60 * 15); // 15 minutes expiration

    // const resetLink = `${config.FRONTEND_URL}/auth/reset-password?token=${token}`;

    // Send email logic would go here
  }

  async resetPassword({
    token,
    newPassword,
  }: ResetPasswordRequestDto): Promise<void> {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const userId = await redis.get(`password_reset:${hashedToken}`);

    if (!userId) {
      throw new AppError("Invalid or expired password reset token", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, config.BCRYPT_ROUNDS);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    await redis.del(`password_reset:${hashedToken}`);

    // Send a confirmation email about password change
  }

  async refreshToken(
    refreshToken: RefreshTokenRequestDto
  ): Promise<JwtTokenResponseDto> {
    try {
      const payload = jwt.verify(
        refreshToken,
        config.JWT_REFRESH_SECRET
      ) as jwt.JwtPayload;

      const storedToken = await redis.get(`refresh_token:${payload.userId}`);

      if (storedToken !== refreshToken) {
        throw new AppError("Invalid refresh token", 401);
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new AppError("User not found", 404);
      }

      await redis.del(`refresh_token:${payload.userId}`);

      return await this.generateTokens(user.id, user.email);
    } catch {
      throw new AppError("Invalid refresh token", 401);
    }
  }

  async logout(refreshToken: LogoutTokenRequestDto): Promise<void> {
    try {
      const payload = jwt.verify(
        refreshToken,
        config.JWT_REFRESH_SECRET
      ) as jwt.JwtPayload;
      await redis.del(`refresh_token:${payload.userId}`);
    } catch (error) {
      logger.warn("Logout with invalid token", { error });
    }
  }

  async validateToken(
    token: ValidateTokenRequestDto
  ): Promise<ValidateTokenResponseDto> {
    try {
      const payload = jwt.verify(token, config.JWT_SECRET) as jwt.JwtPayload;

      return {
        id: payload.userId,
        email: payload.email,
      };
    } catch {
      throw new AppError("Unauthorized", 401);
    }
  }

  private async generateTokens(
    userId: string,
    email: string
  ): Promise<JwtTokenResponseDto> {
    const accessToken = jwt.sign(
      { userId, email, type: "access" },
      config.JWT_SECRET as string,
      {
        expiresIn: config.JWT_EXPIRES_IN as SignOptions["expiresIn"],
      }
    );

    const refreshToken = jwt.sign(
      { userId, email, type: "refresh" },
      config.JWT_REFRESH_SECRET as string,
      {
        expiresIn: config.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
      }
    );

    await redis.set(
      `refresh_token:${userId}`,
      refreshToken,
      "EX",
      7 * 24 * 60 * 60 // 7 days expiration
    );

    return { accessToken, refreshToken };
  }
}

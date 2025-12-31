import z from "zod";
import {
  forgotPasswordSchema,
  jwtTokenSchema,
  loginUserSchema,
  logoutSchema,
  refreshTokenSchema,
  registerUserSchema,
  resetPasswordSchema,
  validateTokenSchema,
} from "../validators/auth.validators.js";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export type JwtTokenResponseDto = z.infer<typeof jwtTokenSchema>;

export interface AuthResponseDto extends JwtTokenResponseDto {
  user: User;
}

export type RegisterUserRequestDto = z.infer<typeof registerUserSchema>;
export type LoginUserRequestDto = z.infer<typeof loginUserSchema>;

export type ValidateTokenRequestDto = z.infer<typeof validateTokenSchema>;
export type LogoutTokenRequestDto = z.infer<typeof logoutSchema>;
export type RefreshTokenRequestDto = z.infer<typeof refreshTokenSchema>;

export type ResetPasswordRequestDto = z.infer<typeof resetPasswordSchema>;
export type ForgotPasswordRequestDto = z.infer<typeof forgotPasswordSchema>;

export type ValidateTokenResponseDto = Omit<User, "firstName" | "lastName">;

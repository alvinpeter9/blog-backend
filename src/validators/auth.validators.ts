import z from "zod";

export const emailSchema = z.email("Email must be a valid email address");

const passwordSchema = z
  .string({ error: "Password is required" })
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const tokenSchema = z
  .string({ error: "Token is required" })
  .min(1, "Token cannot be empty");

export const registerUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z
    .string({ error: "First name is required" })
    .min(1, "First name cannot be empty")
    .max(100),
  lastName: z
    .string({ error: "Last name is required" })
    .min(1, "Last name cannot be empty")
    .max(100),
});

export const loginUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const resetPasswordSchema = z.object({
  token: tokenSchema,
  newPassword: passwordSchema,
});

export const forgotPasswordSchema = emailSchema;

export const refreshTokenSchema = tokenSchema;

export const logoutSchema = tokenSchema;

export const validateTokenSchema = tokenSchema;

export const jwtTokenSchema = z.object({
  accessToken: tokenSchema,
  refreshToken: tokenSchema,
});

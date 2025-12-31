import "dotenv/config";
import { z } from "zod";

const configSchema = z.object({
  ENV: z.enum(["development", "production", "test"]),
  PORT: z.number().default(3001),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGIN: z.string().default("*"),
  BCRYPT_ROUNDS: z.number().default(12),
});

const parseConfig = () => {
  const config = {
    ENV: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.PORT || "3001", 10),
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
    BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || "12", 10),
  };

  return configSchema.parse(config);
};

export const config = parseConfig();

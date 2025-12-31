import { Redis } from "ioredis";
import { config } from "./index.js";
import { logger } from "../utils/logger.js";

const redisUrl = config.REDIS_URL!;

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on("connect", () => {
  logger.info("Redis connected");
});

redis.on("error", (error: Error) => {
  logger.error("Redis connection error", { error });
});

redis.on("close", () => {
  logger.warn("Redis connection closed");
});

process.on("SIGTERM", () => {
  redis.disconnect();
});

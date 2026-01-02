import rateLimit from "express-rate-limit";

/**
 * API Rate Limiter Middleware
 * Limits the number of requests from a single IP within a specified time window.
 * @param requestCount - Maximum number of requests allowed within the time window (default is 10).
 * @returns Rate limiting middleware.
 */

export const apiRateLimiter = (requestCount: number = 10) => {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: requestCount, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
    message: {
      success: false,
      message: "Too many requests. Please try again later.",
    },
  });

  return limiter;
};

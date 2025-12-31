import express from "express";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import healthRoutes from "./routes/health.route.js";
import { logger } from "./utils/logger.js";
import { config } from "./config/index.js";
import { prisma } from "./config/database.js";
import { errorHandler } from "./middleware/error-handler.js";
import rateLimit from "express-rate-limit";

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  next();
});

app.get("/", async (_req, res) => {
  res.json({ message: "Hi, welcome to blog service." });
});

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/health", healthRoutes);

// Error handling
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = async () => {
  logger.info("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// Start server
app.listen(config.PORT, () => {
  logger.info(`Blog Service running on port ${config.PORT}`);
  logger.info(`Environment: ${config.ENV}`);
});

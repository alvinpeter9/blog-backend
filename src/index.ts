import express from "express";
import { logger } from "./utils/logger.js";
import { config } from "./config/index.js";
import { prisma } from "./config/database.js";
import { errorHandler } from "./middleware/error-handler.js";
import cookieParser from "cookie-parser";
import {
  healthRoutes,
  authRoutes,
  categoryRoutes,
  commentRoutes,
  postRoutes,
  userRoutes,
} from "./routes/index.js";

export const app = express();
app.set("trust proxy", 1); // For load balancers, proxies, etc.

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Middleware
app.use(cookieParser());

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
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/health", healthRoutes);

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

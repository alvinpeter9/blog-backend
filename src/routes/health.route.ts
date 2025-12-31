import { Router } from "express";
import { prisma } from "../config/database.js";
import { redis } from "../config/redis.js";

const router = Router();

router.get("/", async (_req, res) => {
  res.json({
    success: true,
    services: "Blog-Service",
    timestamp: new Date().toISOString(),
  });
});

router.get("/ready", async (_, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    await redis.ping();

    res.json({
      success: true,
      database: "connected",
      redis: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      database: "disconnected",
      redis: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
});

router.get("/live", (_, res) => {
  res.json({
    success: true,
    alive: true,
    timestamp: new Date().toISOString(),
  });
});

export default router;

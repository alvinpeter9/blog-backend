import { Request, Response } from "express";
import { AppError } from "../utils/app-error.js";
import { logger } from "../utils/logger.js";
import { config } from "../config/index.js";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response
) => {
  let statusCode = 500;
  let message = "Internal server error";
  let isOperational = false;
  let details = null;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
    details = err.errors;
  }

  logger.error("Error occurred", {
    error: err.message,
    stack: err.stack,
    statusCode,
    path: req.path,
    method: req.method,
    isOperational,
  });

  if (config.ENV === "production" && !isOperational) {
    message = "Something went wrong";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
    ...(config.ENV === "development" && { stack: err.stack }),
  });
};

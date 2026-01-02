import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

/**
 * Authentication middleware to validate JWT tokens from cookies.
 * If valid, attaches the user payload to the request object.
 * If invalid or absent, passes an error to the next middleware.
 */

const authService = new AuthService();

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.accessToken as string;
    const payload = await authService.validateToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};

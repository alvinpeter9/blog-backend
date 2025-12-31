import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";
import { AppError } from "../utils/app-error.js";

declare global {
  namespace Express {
    interface Request {
      validatedQuery?: any;
    }
  }
}

type Location = "body" | "params" | "query";

export const validate =
  (schema: ZodType, location: Location = "body") =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req[location]);
      if (location === "query") {
        req.validatedQuery = parsed; // cannot mutate req.query
      } else {
        req[location] = parsed;
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));

        next(new AppError("Validation failed", 400, true, errors));
      }

      next(err);
    }
  };

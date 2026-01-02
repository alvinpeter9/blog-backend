import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";
import { AppError } from "../utils/app-error.js";
import { ValidationLocation } from "../types/index.js";

/**
 * Validation middleware using Zod schemas.
 * Validates request data in the specified location (body, query, params).
 * On success, attaches the validated data to the request object.
 * On failure, passes a validation error to the next middleware.
 * @param schema - The Zod schema to validate against
 * @param location - The location of the data to validate (default: "body")
 */

export const validate =
  (schema: ZodType, location: ValidationLocation = "body") =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req[location]);
      if (location === "query") {
        req.validatedQuery = parsed as Record<string, unknown>; // cannot mutate req.query
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

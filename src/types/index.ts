declare global {
  namespace Express {
    interface Request {
      validatedQuery?: Record<string, unknown>;
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export type ValidationLocation = "body" | "params" | "query";

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errors?: Array<Record<string, string>> | null;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    errors: Array<Record<string, string>> | null = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

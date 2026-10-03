export class ApiError extends Error {
  statusCode: number;
  details?: unknown;
  isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    details?: unknown
  ) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
import { Response } from "express";

interface ApiResponseOptions<T> {
  statusCode?: number;
  message?: string;
  data?: T;
}

export const sendSuccess = <T>(
  res: Response,
  options: ApiResponseOptions<T> = {}
): Response => {
  const {
    statusCode = 200,
    message = "Request successful",
    data,
  } = options;

  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined ? { data } : {}),
  });
};
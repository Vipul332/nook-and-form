import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.flatten(),
      });
    }

    const data = result.data as {
      body?: Request["body"];
      params?: Request["params"];
      query?: Request["query"];
    };

    if (data.body !== undefined) {
      req.body = data.body;
    }

    if (data.params !== undefined) {
      req.params = data.params;
    }

    if (data.query !== undefined) {
      Object.assign(req.query, data.query); // ✅ mutate in place instead of reassigning
    }

    next();
  };
};
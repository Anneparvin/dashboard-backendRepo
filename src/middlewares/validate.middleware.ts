// src/middlewares/validate.middleware.ts
import { RequestHandler } from "express";
import { ZodError, ZodType } from "zod";
import { ApiError } from "../utils/ApiError";

const formatIssues = (error: ZodError) =>
  error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));

export const validateBody =
  (schema: ZodType): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new ApiError(400, "Validation failed", formatIssues(result.error)));
    }
    req.body = result.data;
    next();
  };

// Express 5-এ req.query শুধু পড়া যায় (read-only), তাই পরিষ্কার ডেটা res.locals-এ রাখা হয়
export const validateQuery =
  (schema: ZodType): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return next(new ApiError(400, "Validation failed", formatIssues(result.error)));
    }
    res.locals.query = result.data;
    next();
  };

export const validateParams =
  (schema: ZodType): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return next(new ApiError(400, "Validation failed", formatIssues(result.error)));
    }
    res.locals.params = result.data;
    next();
  };
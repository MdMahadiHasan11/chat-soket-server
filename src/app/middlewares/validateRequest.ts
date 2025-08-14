import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodRawShape } from "zod";
import asyncHandler from "../utils/asyncHandler";

export const validateRequest = (zodSchema: ZodObject<ZodRawShape>) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    if (req.body && typeof req.body.data === "string" && req.body.data.trim()) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch {
        return next({
          statusCode: 400,
          message: "Invalid JSON format in 'data' field",
        });
      }
    }

    req.body = await zodSchema.parseAsync(req.body || {});
    next();
  });

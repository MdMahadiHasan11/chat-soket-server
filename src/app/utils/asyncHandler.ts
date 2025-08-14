/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;
const asyncHandler =
  (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch((err) => {
      if (envVars.NODE_ENV === "development") {
        console.log("async Error Handler from:", err);
      }
      next(err);
    });

export default asyncHandler;

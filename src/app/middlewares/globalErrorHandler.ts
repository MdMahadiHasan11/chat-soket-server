/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";
import AppError from "../errorHelpers/AppError";
import { ZodError } from "zod";
import {
  ErrorHandler,
  ErrorResponse,
} from "../errorHelpers/errorFunctionInterface";
import { handleDuplicateKeyError } from "../errorHelpers/errorFunction/handleDuplicateKeyError";
import { handleCastError } from "../errorHelpers/errorFunction/handleCastError";
import { handleValidationError } from "../errorHelpers/errorFunction/handleValidationError";
import { handleZodError } from "../errorHelpers/errorFunction/handleZodError";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";

// Handler for custom AppError
const handleAppError: ErrorHandler = (err: AppError) => {
  const statusCode = err.statusCode;
  const message = err.message;

  // console.log("App Error:", message);
  return {
    statusCode,
    message,
    errors: { general: message },
  };
};

// Handler for generic Error
const handleGenericError: ErrorHandler = (err: Error) => {
  const statusCode = 400;
  const message = err.message;

  // console.log("Generic Error:", message);
  return {
    statusCode,
    message,
    errors: { general: message },
  };
};

// Default error handler
const handleDefaultError: ErrorHandler = () => {
  const statusCode = 500;
  const message = "Something went wrong!";

  // console.log("Default Error:", message);
  return {
    statusCode,
    message,
    errors: { general: message },
  };
};

// Main global error handler
export const globalErrorHandler: ErrorRequestHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (envVars.NODE_ENV === "development") {
    console.log("Global Error Handler");
    console.log(err);
  }

  let errorResponse: ReturnType<ErrorHandler>;

  if (req.file) {
    await deleteImageFromCLoudinary(req.file.path);
  }

  if (req.files && Array.isArray(req.files) && req.files.length) {
    const imageUrls = (req.files as Express.Multer.File[]).map(
      (file) => file.path
    );

    await Promise.all(imageUrls.map((url) => deleteImageFromCLoudinary(url)));
  }

  // Determine which error handler to use
  switch (true) {
    case err.code === 11000:
      errorResponse = handleDuplicateKeyError(err);
      break;
    case err.name === "CastError":
      errorResponse = handleCastError(err);
      break;
    case err.name === "ValidationError":
      errorResponse = handleValidationError(err);
      break;
    case err instanceof ZodError:
      errorResponse = handleZodError(err);
      break;
    case err instanceof AppError:
      errorResponse = handleAppError(err);
      break;
    case err instanceof Error:
      errorResponse = handleGenericError(err);
      break;
    default:
      errorResponse = handleDefaultError(err);
      break;
  }

  // Construct response
  const response: ErrorResponse = {
    success: false,
    message: errorResponse.message,
    errors:
      Object.keys(errorResponse.errors).length > 0
        ? errorResponse.errors
        : undefined,
    error: envVars.NODE_ENV === "development" ? err : undefined,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  };

  res.status(errorResponse.statusCode).json(response);
  next();
};

import { ErrorHandler } from "../errorFunctionInterface";

// Handler for Mongoose duplicate key error
export const handleDuplicateKeyError: ErrorHandler = (err) => {
  const statusCode =
    err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 400;
  const duplicateValue =
    err.message?.match(/(["'])(\\?.)*?\1/)?.[0] || "Duplicate key";
  const message = `${duplicateValue} already exists.`;

  //   console.log("Duplicate key error:", message);
  return {
    statusCode,
    message,
    errors: { duplicate: message },
  };
};

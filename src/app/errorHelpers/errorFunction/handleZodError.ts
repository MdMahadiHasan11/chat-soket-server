import { ZodError } from "zod";
import { ErrorHandler } from "../errorFunctionInterface";

// Handler for Zod validation error
export const handleZodError: ErrorHandler = (err: ZodError) => {
  const statusCode = 400;
  const errors: Record<string, string> = {};

  const message = err.issues
    .map((issue) => {
      const field = issue.path.join(".");
      const fieldMessage = `The '${field}' field is invalid: ${issue.message}`;
      errors[field] = issue.message;
      return fieldMessage;
    })
    .join(" ");

  //   console.log("Zod Validation Error:", message);
  return { statusCode, message, errors };
};

import { ErrorHandler } from "../errorFunctionInterface";

// Handler for Mongoose validation error
export const handleValidationError: ErrorHandler = (err) => {
  const statusCode = 400;
  const errors: Record<string, string> = {};

  const message = Object.entries(err.errors)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map(([field, error]: [string, any]) => {
      const type = error?.kind ?? "invalid";
      const userValue = error?.value ?? "undefined";
      const fieldMessage = `The '${field}' field must be a valid ${type} (received: "${userValue}").`;
      errors[field] = fieldMessage;
      return fieldMessage;
    })
    .join(" ");

  //   console.log("Validation Error:", message);
  return { statusCode, message, errors };
};

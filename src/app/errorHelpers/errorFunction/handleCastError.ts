import { ErrorHandler } from "../errorFunctionInterface";

// Handler for Mongoose cast error
export const handleCastError: ErrorHandler = (err) => {
  const statusCode = 400;
  const message = `Invalid value for '${err?.path}': "${err?.value}".`;

  //   console.log("Cast Error:", message);
  return {
    statusCode,
    message,
    errors: { [err?.path]: message },
  };
};

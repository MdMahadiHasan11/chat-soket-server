"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError = void 0;
// Handler for Zod validation error
const handleZodError = (err) => {
    const statusCode = 400;
    const errors = {};
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
exports.handleZodError = handleZodError;

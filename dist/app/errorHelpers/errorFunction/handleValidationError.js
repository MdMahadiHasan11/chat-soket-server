"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationError = void 0;
// Handler for Mongoose validation error
const handleValidationError = (err) => {
    const statusCode = 400;
    const errors = {};
    const message = Object.entries(err.errors)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map(([field, error]) => {
        var _a, _b;
        const type = (_a = error === null || error === void 0 ? void 0 : error.kind) !== null && _a !== void 0 ? _a : "invalid";
        const userValue = (_b = error === null || error === void 0 ? void 0 : error.value) !== null && _b !== void 0 ? _b : "undefined";
        const fieldMessage = `The '${field}' field must be a valid ${type} (received: "${userValue}").`;
        errors[field] = fieldMessage;
        return fieldMessage;
    })
        .join(" ");
    //   console.log("Validation Error:", message);
    return { statusCode, message, errors };
};
exports.handleValidationError = handleValidationError;

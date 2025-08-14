"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateKeyError = void 0;
// Handler for Mongoose duplicate key error
const handleDuplicateKeyError = (err) => {
    var _a, _b;
    const statusCode = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 400;
    const duplicateValue = ((_b = (_a = err.message) === null || _a === void 0 ? void 0 : _a.match(/(["'])(\\?.)*?\1/)) === null || _b === void 0 ? void 0 : _b[0]) || "Duplicate key";
    const message = `${duplicateValue} already exists.`;
    //   console.log("Duplicate key error:", message);
    return {
        statusCode,
        message,
        errors: { duplicate: message },
    };
};
exports.handleDuplicateKeyError = handleDuplicateKeyError;

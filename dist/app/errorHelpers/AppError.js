"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    //   public status: string;
    constructor(statusCode, message, stack = "") {
        super(message); //trow new error
        this.statusCode = statusCode;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
        // this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        // this.isOperational = true;
    }
}
exports.default = AppError;

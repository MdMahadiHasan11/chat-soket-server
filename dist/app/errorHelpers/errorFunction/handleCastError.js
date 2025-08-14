"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCastError = void 0;
// Handler for Mongoose cast error
const handleCastError = (err) => {
    const statusCode = 400;
    const message = `Invalid value for '${err === null || err === void 0 ? void 0 : err.path}': "${err === null || err === void 0 ? void 0 : err.value}".`;
    //   console.log("Cast Error:", message);
    return {
        statusCode,
        message,
        errors: { [err === null || err === void 0 ? void 0 : err.path]: message },
    };
};
exports.handleCastError = handleCastError;

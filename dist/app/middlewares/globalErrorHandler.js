"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const zod_1 = require("zod");
const handleDuplicateKeyError_1 = require("../errorHelpers/errorFunction/handleDuplicateKeyError");
const handleCastError_1 = require("../errorHelpers/errorFunction/handleCastError");
const handleValidationError_1 = require("../errorHelpers/errorFunction/handleValidationError");
const handleZodError_1 = require("../errorHelpers/errorFunction/handleZodError");
const cloudinary_config_1 = require("../../config/cloudinary.config");
// Handler for custom AppError
const handleAppError = (err) => {
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
const handleGenericError = (err) => {
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
const handleDefaultError = () => {
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
const globalErrorHandler = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (env_1.envVars.NODE_ENV === "development") {
        console.log("Global Error Handler");
        console.log(err);
    }
    let errorResponse;
    if (req.file) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(req.file.path);
    }
    if (req.files && Array.isArray(req.files) && req.files.length) {
        const imageUrls = req.files.map((file) => file.path);
        yield Promise.all(imageUrls.map((url) => (0, cloudinary_config_1.deleteImageFromCLoudinary)(url)));
    }
    // Determine which error handler to use
    switch (true) {
        case err.code === 11000:
            errorResponse = (0, handleDuplicateKeyError_1.handleDuplicateKeyError)(err);
            break;
        case err.name === "CastError":
            errorResponse = (0, handleCastError_1.handleCastError)(err);
            break;
        case err.name === "ValidationError":
            errorResponse = (0, handleValidationError_1.handleValidationError)(err);
            break;
        case err instanceof zod_1.ZodError:
            errorResponse = (0, handleZodError_1.handleZodError)(err);
            break;
        case err instanceof AppError_1.default:
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
    const response = {
        success: false,
        message: errorResponse.message,
        errors: Object.keys(errorResponse.errors).length > 0
            ? errorResponse.errors
            : undefined,
        error: env_1.envVars.NODE_ENV === "development" ? err : undefined,
        stack: env_1.envVars.NODE_ENV === "development" ? err.stack : null,
    };
    res.status(errorResponse.statusCode).json(response);
    next();
});
exports.globalErrorHandler = globalErrorHandler;

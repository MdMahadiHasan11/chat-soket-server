"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ error: "Name is required" })
        .min(1, { message: "Name is required" })
        .max(50, { message: "Name is too long" }),
    email: zod_1.default
        .string({ error: "Email is required" })
        .email({ message: "Invalid email" })
        .min(1, { message: "Email is required" })
        .max(50, { message: "Email is too long" }),
    password: zod_1.default
        .string({ error: "Password is required" })
        .min(8, { message: "Password is required min 8 character" })
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
        message: "Password must contain at least one letter and one number",
    }),
    phone: zod_1.default
        .string({ error: "Phone is required" })
        .min(9, { message: "Phone is required" })
        .max(15, { message: "Phone is too long" })
        .regex(/^[0-9]+$/, {
        message: "Phone number must contain only digits",
    })
        .optional(),
    address: zod_1.default
        .string()
        .min(1, { message: "Address is required" })
        .max(255)
        .optional(),
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ error: "Name is required" })
        .min(1, { message: "Name is required" })
        .max(50, { message: "Name is too long" })
        .optional(),
    // password: z
    //   .string({ error: "Password is required" })
    //   .min(8, { message: "Password is required min 8 character" })
    //   .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    //     message: "Password must contain at least one letter and one number",
    //   })
    //   .optional(),
    phone: zod_1.default
        .string({ error: "Phone is required" })
        .min(9, { message: "Phone is required" })
        .max(15, { message: "Phone is too long" })
        .regex(/^[0-9]+$/, {
        message: "Phone number must contain only digits",
    })
        .optional(),
    address: zod_1.default
        .string()
        .min(1, { message: "Address is required" })
        .max(255)
        .optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).optional(),
    isActive: zod_1.default.enum(Object.values(user_interface_1.isActive)).optional(),
    isVerified: zod_1.default.boolean().optional(),
});

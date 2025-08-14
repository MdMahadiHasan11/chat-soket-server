"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookQueryZodSchema = exports.updateBookZodSchema = exports.createBookZodSchema = exports.genreEnum = void 0;
const zod_1 = require("zod");
// Genre Enum
exports.genreEnum = zod_1.z.enum([
    "FICTION",
    "NON_FICTION",
    "SCIENCE",
    "HISTORY",
    "BIOGRAPHY",
    "FANTASY",
]);
// Create Book Schema
exports.createBookZodSchema = zod_1.z.object({
    title: zod_1.z.string().nonempty({ message: "Title is required" }),
    author: zod_1.z.string().nonempty({ message: "Author is required" }),
    genre: exports.genreEnum,
    isbn: zod_1.z.string().nonempty({ message: "ISBN is required" }),
    description: zod_1.z.string().optional(),
    copies: zod_1.z
        .number()
        .int()
        .min(0, {
        message: "Copies is required and must be a non-negative integer",
    }),
    available: zod_1.z
        .boolean()
        .refine((val) => typeof val === "boolean", {
        message: "Available status is required",
    }),
});
// Update Book Schema
exports.updateBookZodSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    author: zod_1.z.string().optional(),
    genre: exports.genreEnum.optional(),
    isbn: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    copies: zod_1.z
        .number()
        .int()
        .min(0, { message: "Copies must be a non-negative integer" })
        .optional(),
    available: zod_1.z.boolean().optional(),
});
// Query Schema for getBooks
exports.bookQueryZodSchema = zod_1.z
    .object({
    filter: exports.genreEnum.optional(), // Validate filter as a valid genre
    sortBy: zod_1.z.enum(["title", "author", "createdAt", "copies"]).optional(), // Valid sort fields
    sort: zod_1.z.enum(["asc", "desc"]).optional(),
    limit: zod_1.z
        .string()
        .regex(/^\d+$/, { message: "Limit must be a valid number" })
        .optional(), // Keep as string
})
    .strict();

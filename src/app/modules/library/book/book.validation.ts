import { z } from "zod";

// Genre Enum
export const genreEnum = z.enum([
  "FICTION",
  "NON_FICTION",
  "SCIENCE",
  "HISTORY",
  "BIOGRAPHY",
  "FANTASY",
]);

// Create Book Schema
export const createBookZodSchema = z.object({
  title: z.string().nonempty({ message: "Title is required" }),
  author: z.string().nonempty({ message: "Author is required" }),
  genre: genreEnum,
  isbn: z.string().nonempty({ message: "ISBN is required" }),
  description: z.string().optional(),
  copies: z
    .number()
    .int()
    .min(0, {
      message: "Copies is required and must be a non-negative integer",
    }),
  available: z
    .boolean()
    .refine((val) => typeof val === "boolean", {
      message: "Available status is required",
    }),
});

// Update Book Schema
export const updateBookZodSchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  genre: genreEnum.optional(),
  isbn: z.string().optional(),
  description: z.string().optional(),
  copies: z
    .number()
    .int()
    .min(0, { message: "Copies must be a non-negative integer" })
    .optional(),
  available: z.boolean().optional(),
});

// Query Schema for getBooks
export const bookQueryZodSchema = z
  .object({
    filter: genreEnum.optional(), // Validate filter as a valid genre
    sortBy: z.enum(["title", "author", "createdAt", "copies"]).optional(), // Valid sort fields
    sort: z.enum(["asc", "desc"]).optional(),
    limit: z
      .string()
      .regex(/^\d+$/, { message: "Limit must be a valid number" })
      .optional(), // Keep as string
  })
  .strict();

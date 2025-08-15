import z from "zod";
import { Types } from "mongoose";

// Helper for ObjectId validation
const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: "Invalid ObjectId format",
});

// Create Message Schema
export const createMessageZodSchema = z.object({
  senderId: objectIdSchema,
  receiverId: objectIdSchema,
  text: z
    .string({ message: "Text is required" })
    .min(1, { message: "Text is required" })
    .max(1000, { message: "Text is too long" })
    .optional(),
  media: z.string().url({ message: "Invalid media URL" }).optional(),
  seen: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
});

// Update Message Schema
export const updateMessageZodSchema = z.object({
  text: z
    .string()
    .min(1, { message: "Text cannot be empty" })
    .max(1000, { message: "Text is too long" })
    .optional(),
  media: z.array(z.string().url({ message: "Invalid media URL" })).optional(),
  seen: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});

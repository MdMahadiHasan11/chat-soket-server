import z from "zod";
import { isActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name is too long" }),

  email: z
    .string({ error: "Email is required" })
    .email({ message: "Invalid email" })
    .min(1, { message: "Email is required" })
    .max(50, { message: "Email is too long" }),

  password: z
    .string({ error: "Password is required" })
    .min(8, { message: "Password is required min 8 character" })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      message: "Password must contain at least one letter and one number",
    }),

  phone: z
    .string({ error: "Phone is required" })
    .min(9, { message: "Phone is required" })
    .max(15, { message: "Phone is too long" })
    .regex(/^[0-9]+$/, {
      message: "Phone number must contain only digits",
    })
    .optional(),
  address: z
    .string()
    .min(1, { message: "Address is required" })
    .max(255)
    .optional(),
});

export const updateUserZodSchema = z.object({
  name: z
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

  phone: z
    .string({ error: "Phone is required" })
    .min(9, { message: "Phone is required" })
    .max(15, { message: "Phone is too long" })
    .regex(/^[0-9]+$/, {
      message: "Phone number must contain only digits",
    })
    .optional(),
  picture: z.string().optional(),
  address: z
    .string()
    .min(1, { message: "Address is required" })
    .max(255)
    .optional(),

  role: z.enum(Object.values(Role) as string[]).optional(),
  isActive: z.enum(Object.values(isActive) as string[]).optional(),
  isVerified: z.boolean().optional(),
});

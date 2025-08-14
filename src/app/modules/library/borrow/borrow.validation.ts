import { z } from "zod";

export const createBorrowZodSchema = z.object({
  book: z.string().min(1, "Book ID is required"),
  quantity: z.number().min(1, "At least one book must be borrowed"),
  dueDate: z.coerce.date({ error: "Due date is required" }),
});

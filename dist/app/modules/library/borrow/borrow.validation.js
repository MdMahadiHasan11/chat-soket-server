"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBorrowZodSchema = void 0;
const zod_1 = require("zod");
exports.createBorrowZodSchema = zod_1.z.object({
    book: zod_1.z.string().min(1, "Book ID is required"),
    quantity: zod_1.z.number().min(1, "At least one book must be borrowed"),
    dueDate: zod_1.z.coerce.date({ error: "Due date is required" }),
});

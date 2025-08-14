import { Schema, model } from "mongoose";
import { IBorrowDocument } from "./borrow.interface";

const borrowSchema = new Schema<IBorrowDocument>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book reference is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
  },
  {
    timestamps: true,
  }
);

export const Borrow = model<IBorrowDocument>("Borrow", borrowSchema);

import { Schema, model } from "mongoose";
import {
  IBookDocument,
  IBookInstanceMethods,
  BookModelType,
} from "./book.interface";

const bookSchema = new Schema<
  IBookDocument,
  BookModelType,
  IBookInstanceMethods
>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: {
      type: String,
      enum: [
        "FICTION",
        "NON_FICTION",
        "SCIENCE",
        "HISTORY",
        "BIOGRAPHY",
        "FANTASY",
      ],
      required: true,
    },
    isbn: { type: String, required: true, unique: true },
    description: { type: String },
    copies: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

bookSchema.method("updateAvailability", async function () {
  // Update the availability based on the number of copies
  this.available = this.copies > 0;
  return await this.save();
});

export const Book = model<IBookDocument, BookModelType>("Book", bookSchema);

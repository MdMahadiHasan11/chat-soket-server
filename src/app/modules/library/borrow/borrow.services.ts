import { Borrow } from "./borrow.model";
import { Book } from "../book/book.model";

const borrowBook = async (bookId: string, quantity: number, dueDate: Date) => {
  const book = await Book.findById(bookId);
  if (!book) throw new Error("Book not found");

  if (book.copies < quantity) {
    throw new Error("Not enough copies available");
  }

  book.copies -= quantity;
  await book.updateAvailability();

  const borrowed = await Borrow.create({ book: bookId, quantity, dueDate });
  return borrowed;
};

const getBorrowSummary = async () => {
  const summary = await Borrow.aggregate([
    {
      $group: {
        _id: "$book",
        totalQuantity: { $sum: "$quantity" },
      },
    },
    {
      $lookup: {
        from: "books",
        localField: "_id",
        foreignField: "_id",
        as: "bookDetails",
      },
    },
    {
      $unwind: "$bookDetails",
    },
    {
      $project: {
        _id: 0,
        totalQuantity: 1,
        book: {
          title: "$bookDetails.title",
          isbn: "$bookDetails.isbn",
        },
      },
    },
  ]);

  return {
    success: true,
    message: "Borrowed books summary retrieved successfully",
    data: summary,
  };
};

export const BorrowService = {
  borrowBook,
  getBorrowSummary,
};

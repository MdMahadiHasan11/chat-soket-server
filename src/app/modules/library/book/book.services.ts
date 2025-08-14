import { FilterQuery } from "mongoose";
import { IBook, IBookDocument, IBookQuery } from "./book.interface";
import { Book } from "./book.model";

export const createBook = async (payload: IBook) => {
  const book = new Book(payload);
  return await book.save();
};

export const getBooks = async (query: IBookQuery) => {
  const filter: FilterQuery<IBookDocument> = {};
  if (query.filter) filter.genre = query.filter;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sort === "asc" ? 1 : -1;
  const limit = Number(query.limit) || 10;

  return await Book.find(filter)
    .sort({ [sortBy]: sortOrder })
    .limit(limit);
};
export const getBookById = async (id: string) => {
  return await Book.findById(id);
};

export const updateBook = async (id: string, payload: Partial<IBook>) => {
  return await Book.findByIdAndUpdate(id, payload, { new: true });
};
export const deleteBook = async (id: string) => {
  return await Book.findByIdAndDelete(id);
};

export const BookService = {
  createBook,
  getBooks,
  updateBook,
  getBookById,
  deleteBook,
};

import express from "express";
import {
  createBook,
  deleteBook,
  getBookById,
  getBooks,
  updateBook,
} from "./book.controller"; // Import from controller, not services

export const bookRoutes = express.Router();

bookRoutes.post("/", createBook); // Create a new book
bookRoutes.get("/", getBooks); // Get books with optional query parameters
bookRoutes.get("/:id", getBookById); // Get a specific book by ID (if needed, implement in controller)
bookRoutes.put("/:id", updateBook);
bookRoutes.delete("/:id", deleteBook);

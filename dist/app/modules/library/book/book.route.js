"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("./book.controller"); // Import from controller, not services
exports.bookRoutes = express_1.default.Router();
exports.bookRoutes.post("/", book_controller_1.createBook); // Create a new book
exports.bookRoutes.get("/", book_controller_1.getBooks); // Get books with optional query parameters
exports.bookRoutes.get("/:id", book_controller_1.getBookById); // Get a specific book by ID (if needed, implement in controller)
exports.bookRoutes.put("/:id", book_controller_1.updateBook);
exports.bookRoutes.delete("/:id", book_controller_1.deleteBook);

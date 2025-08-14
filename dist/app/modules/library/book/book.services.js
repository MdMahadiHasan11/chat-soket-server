"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = exports.deleteBook = exports.updateBook = exports.getBookById = exports.getBooks = exports.createBook = void 0;
const book_model_1 = require("./book.model");
const createBook = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const book = new book_model_1.Book(payload);
    return yield book.save();
});
exports.createBook = createBook;
const getBooks = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {};
    if (query.filter)
        filter.genre = query.filter;
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sort === "asc" ? 1 : -1;
    const limit = Number(query.limit) || 10;
    return yield book_model_1.Book.find(filter)
        .sort({ [sortBy]: sortOrder })
        .limit(limit);
});
exports.getBooks = getBooks;
const getBookById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield book_model_1.Book.findById(id);
});
exports.getBookById = getBookById;
const updateBook = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield book_model_1.Book.findByIdAndUpdate(id, payload, { new: true });
});
exports.updateBook = updateBook;
const deleteBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield book_model_1.Book.findByIdAndDelete(id);
});
exports.deleteBook = deleteBook;
exports.BookService = {
    createBook: exports.createBook,
    getBooks: exports.getBooks,
    updateBook: exports.updateBook,
    getBookById: exports.getBookById,
    deleteBook: exports.deleteBook,
};

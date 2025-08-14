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
exports.deleteBook = exports.updateBook = exports.getBookById = exports.getBooks = exports.createBook = void 0;
const book_validation_1 = require("./book.validation");
const book_services_1 = require("./book.services");
const sendResponse_1 = require("../../../utils/sendResponse");
// import { sendResponse } from "../../../utils/sendResponse";
// import { BookService } from "./book.services";
const createBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body with Zod
        const validatedData = book_validation_1.createBookZodSchema.parse(req.body);
        // Call service with validated data
        const result = yield book_services_1.BookService.createBook(validatedData);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: 201,
            success: true,
            message: "Book created successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createBook = createBook;
const getBooks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate query parameters with Zod
        const validatedQuery = book_validation_1.bookQueryZodSchema.parse(req.query);
        // Call service with validated query
        const result = yield book_services_1.BookService.getBooks(validatedQuery);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: 200,
            success: true,
            message: "Books retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getBooks = getBooks;
const getBookById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        // Validate query parameters with Zod
        // const validatedQuery = bookQueryZodSchema.parse(req.query);
        // Call service with validated query
        const result = yield book_services_1.BookService.getBookById(id);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: 200,
            success: true,
            message: "Book retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getBookById = getBookById;
const updateBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield book_services_1.BookService.updateBook(req.params.id, req.body);
        if (!result) {
            return (0, sendResponse_1.sendResponse)(res, {
                statusCode: 404,
                success: false,
                message: `The book with id ${req.params.id} not found`,
                data: null,
            });
        }
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: 200,
            success: true,
            message: "Book updated successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateBook = updateBook;
const deleteBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteBook = yield book_services_1.BookService.deleteBook(req.params.id);
        if (!deleteBook) {
            return (0, sendResponse_1.sendResponse)(res, {
                statusCode: 404,
                success: false,
                message: `The book with id ${req.params.id} not found`,
                data: null,
            });
        }
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: 200,
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteBook = deleteBook;

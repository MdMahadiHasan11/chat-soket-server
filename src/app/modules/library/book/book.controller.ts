import { NextFunction, Request, Response } from "express";
import { createBookZodSchema, bookQueryZodSchema } from "./book.validation";
import { BookService } from "./book.services";
import { sendResponse } from "../../../utils/sendResponse";
// import { sendResponse } from "../../../utils/sendResponse";
// import { BookService } from "./book.services";

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate request body with Zod
    const validatedData = createBookZodSchema.parse(req.body);

    // Call service with validated data
    const result = await BookService.createBook(validatedData);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Book created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate query parameters with Zod
    const validatedQuery = bookQueryZodSchema.parse(req.query);

    // Call service with validated query
    const result = await BookService.getBooks(validatedQuery);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Books retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    // Validate query parameters with Zod
    // const validatedQuery = bookQueryZodSchema.parse(req.query);

    // Call service with validated query
    const result = await BookService.getBookById(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Book retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await BookService.updateBook(req.params.id, req.body);
    if (!result) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: `The book with id ${req.params.id} not found`,
        data: null,
      });
    }
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Book updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deleteBook = await BookService.deleteBook(req.params.id);
    if (!deleteBook) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: `The book with id ${req.params.id} not found`,
        data: null,
      });
    }
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

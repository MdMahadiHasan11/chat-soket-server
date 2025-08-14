import { Request, Response, NextFunction } from "express";
import { BorrowService } from "./borrow.services";
import { sendResponse } from "../../../utils/sendResponse";
export const borrowBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = req.body;
    const borrowed = await BorrowService.borrowBook(
      parsed.book,
      parsed.quantity,
      parsed.dueDate
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Book borrowed successfully",
      data: borrowed,
    });
  } catch (error) {
    next(error);
  }
};
export const getBorrowSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const summary = await BorrowService.getBorrowSummary();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: summary.data,
    });
  } catch (error) {
    next(error);
  }
};

import { Document, Types } from "mongoose";

export interface IBorrow {
  book: Types.ObjectId;
  quantity: number;
  dueDate: Date;
}

export interface IBorrowDocument extends IBorrow, Document {}

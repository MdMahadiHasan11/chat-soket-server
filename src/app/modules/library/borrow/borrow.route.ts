import express from "express";
import { borrowBook, getBorrowSummary } from "./borrow.controller";
// import { borrowBook, getBorrowSummary } from "./borrow.controller";

export const borrowBookRoutes = express.Router();

borrowBookRoutes.post("/", borrowBook);
borrowBookRoutes.get("/", getBorrowSummary); // Assuming you have a getBorrowSummary function in the controller

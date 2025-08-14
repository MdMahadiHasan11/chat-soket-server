"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowBookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const borrow_controller_1 = require("./borrow.controller");
// import { borrowBook, getBorrowSummary } from "./borrow.controller";
exports.borrowBookRoutes = express_1.default.Router();
exports.borrowBookRoutes.post("/", borrow_controller_1.borrowBook);
exports.borrowBookRoutes.get("/", borrow_controller_1.getBorrowSummary); // Assuming you have a getBorrowSummary function in the controller

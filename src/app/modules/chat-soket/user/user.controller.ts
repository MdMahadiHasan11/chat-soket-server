/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../../utils/sendResponse";
import asyncHandler from "../../../utils/asyncHandler";
import { UserServices } from "./user.service";

const getAllUsersForSidebar = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const result = await UserServices.getAllUsersForSidebar(req.params.id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Users retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const SoketUserControllers = {
  getAllUsersForSidebar,
};

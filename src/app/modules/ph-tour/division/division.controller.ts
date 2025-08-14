import { Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler";
import { DivisionService } from "./divisiona.service";
import { sendResponse } from "../../../utils/sendResponse";
import { IDivision } from "./division.interface";

const createDivision = asyncHandler(async (req: Request, res: Response) => {
  const payload: IDivision = {
    ...req.body,
    thumbnail: req.file?.path,
  };
  const result = await DivisionService.createDivision(payload);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Division created",
    data: result,
  });
});

const getAllDivisions = asyncHandler(async (req: Request, res: Response) => {
  const result = await DivisionService.getAllDivisions();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Divisions retrieved",
    data: result.data,
    meta: result.meta,
  });
});
const getSingleDivision = asyncHandler(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const result = await DivisionService.getSingleDivision(slug);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Divisions retrieved",
    data: result.data,
  });
});

const updateDivision = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload: IDivision = {
    ...req.body,
    thumbnail: req.file?.path,
  };
  // console.log(payload);
  const result = await DivisionService.updateDivision(id, payload);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Division updated",
    data: result,
  });
});

const deleteDivision = asyncHandler(async (req: Request, res: Response) => {
  const result = await DivisionService.deleteDivision(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Division deleted",
    data: result,
  });
});

export const DivisionController = {
  createDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};

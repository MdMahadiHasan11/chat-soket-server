import { Request, Response } from "express";
import { TourService } from "./tour.service";
import asyncHandler from "../../../utils/asyncHandler";
import { sendResponse } from "../../../utils/sendResponse";
import { ITour } from "./tour.interface";

const createTour = asyncHandler(async (req: Request, res: Response) => {
  const payload: ITour = {
    ...req.body,
    images: (req.files as Express.Multer.File[]).map((file) => file.path),
  };
  // console.log(req.body);
  const result = await TourService.createTour(payload);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour created successfully",
    data: result,
  });
});

const getAllTours = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await TourService.getAllTours(query as Record<string, string>);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tours retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const updateTour = asyncHandler(async (req: Request, res: Response) => {
  const payload: Partial<ITour> = {
    ...req.body,
    images:
      req.files && (req.files as Express.Multer.File[]).length > 0
        ? (req.files as Express.Multer.File[]).map((file) => file.path)
        : undefined,
    deleteImages: req.body.deleteImages || [],
  };

  const result = await TourService.updateTour(req.params.id, payload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour updated successfully",
    data: result,
  });
});

const deleteTour = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TourService.deleteTour(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour deleted successfully",
    data: result,
  });
});
const getAllTourTypes = asyncHandler(async (req: Request, res: Response) => {
  const result = await TourService.getAllTourTypes();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour types retrieved successfully",
    data: result,
  });
});

const createTourType = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body;
  //   console.log(payload, "namennnnnnnnnnn");
  const result = await TourService.createTourType(payload);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour type created successfully",
    data: result,
  });
});

const updateTourType = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const result = await TourService.updateTourType(id, name);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour type updated successfully",
    data: result,
  });
});
const deleteTourType = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TourService.deleteTourType(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour type deleted successfully",
    data: result,
  });
});

export const TourController = {
  createTour,
  createTourType,
  getAllTourTypes,
  deleteTourType,
  updateTourType,
  getAllTours,
  updateTour,
  deleteTour,
};

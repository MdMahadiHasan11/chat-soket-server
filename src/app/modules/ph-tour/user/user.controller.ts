/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { sendResponse } from "../../../utils/sendResponse";
import asyncHandler from "../../../utils/asyncHandler";
import { verifyToken } from "../../../utils/jwt";
import { envVars } from "../../../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { IUser } from "./user.interface";

// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // throw new Error("fake error");
//     // throw new AppError(httpStatus.BAD_REQUEST, "fake");
//     const user = await UserServices.createUserService(req.body);

//     res
//       .status(httpStatus.CREATED)
//       .json({ message: "User created successfully", user });
//   } catch (err: any) {
//     console.log(err);
//     next(err);
//   }
// };

const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.createUser(req.body);
    // res
    //   .status(httpStatus.CREATED)
    //   .json({ message: "User created successfully", user });
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User created successfully",
      data: result,
    });
  }
);

const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(
    //   token as string,
    //   envVars.JWT_ACCESS_SECRET
    // ) as JwtPayload;
    const payload: IUser = {
      ...req.body,
      picture: req.file?.path,
    };
    console.log(payload);

    const verifiedToken = req.user;

    const result = await UserServices.updateUser(
      req.params.id,
      payload,
      verifiedToken as JwtPayload
    );
    // res
    //   .status(httpStatus.CREATED)
    //   .json({ message: "User created successfully", user });
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User updated successfully",
      data: result,
    });
  }
);

const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();
    // res.status(httpStatus.OK).json({
    //   success: true,
    //   message: "Users retrieved successfully",
    //   data: users,
    // });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Users retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getMe = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const verifiedToken = req.user as JwtPayload;
    // console.log(verifiedToken);
    const result = await UserServices.getMe(verifiedToken.userId as string);
    // res.status(httpStatus.OK).json({
    //   success: true,
    //   message: "Users retrieved successfully",
    //   data: users,
    // });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User retrieved successfully",
      // meta: result.meta,
      data: result.data,
    });
  }
);

// const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const users = await UserServices.getAllUsers();
//     return users;
//   } catch (err: any) {
//     console.log(err);
//     next(err);
//   }
// };

const getSingleUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await UserServices.getSingleUser(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Retrieved Successfully",
      data: result.data,
    });
  }
);
export const UserControllers = {
  createUser,
  getAllUsers,
  updateUser,
  getMe,
  getSingleUser,
};

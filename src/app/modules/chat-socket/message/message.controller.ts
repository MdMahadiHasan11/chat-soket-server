// /* eslint-disable @typescript-eslint/no-unused-vars */

// import { NextFunction, Request, Response } from "express";
// import httpStatus from "http-status-codes";
// import { sendResponse } from "../../../utils/sendResponse";
// import asyncHandler from "../../../utils/asyncHandler";
// import { MessageServices } from "./message.service";
// import { JwtPayload } from "jsonwebtoken";
// import { cloudinaryUpload } from "../../../../config/cloudinary.config";
// const createMessage = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     // let url = "";
//     // if (req.body.media && !req.file) {
//     //   const upload = await cloudinaryUpload.uploader.upload(
//     //     req.body.media.data
//     //   );
//     //   console.log("upload", upload);
//     //   url = upload.secure_url;
//     // }
//     // console.log("req.body3", req.body);
//     const payload = {
//       ...req.body,
//       media: req.file?.path,
//     };

//     const result = await MessageServices.createMessage(payload);
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Users retrieved successfully",
//       // meta: result.meta,
//       data: result,
//     });
//   }
// );

// //one selected user
// const getAllMessages = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const id = req.params.id;
//     const user = req.user as JwtPayload;

//     const result = await MessageServices.getAllMessages(user.userId, id);

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Users retrieved successfully",
//       meta: result.meta,
//       data: result.data,
//     });
//   }
// );

// //one user
// const getAllMessagesOneUser = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const user = req.user as JwtPayload;

//     const result = await MessageServices.getAllMessagesOneUser(user.userId);

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Users retrieved successfully",
//       meta: result.meta,
//       data: result.data,
//     });
//   }
// );

// const markAsSeen = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const id = req.params.id;
//     const user = req.user as JwtPayload;
//     const result = await MessageServices.markAsSeen(id, user.userId);
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Mark as seen successfully",
//       // meta: result.meta,
//       data: result,
//     });
//   }
// );

// export const MessageControllers = {
//   createMessage,
//   getAllMessages,
//   getAllMessagesOneUser,
//   markAsSeen,
// };

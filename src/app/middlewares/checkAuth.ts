import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/ph-tour/user/user.model";
import { isActive } from "../modules/ph-tour/user/user.interface";
import httpStatus from "http-status-codes";
export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(403, "Access token not found");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isExist = await User.findOne({ email: verifiedToken.email });
      if (!isExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
      }

      if (
        isExist.isActive === isActive.BLOCKED ||
        isExist.isActive === isActive.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "This User can  blocked or inactive"
        );
      }
      if (isExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "This User is deleted");
      }

      if (!isExist.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "This User is not verified");
      }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          403,
          "You are not permitted to access this route!!!"
        );
      }

      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };

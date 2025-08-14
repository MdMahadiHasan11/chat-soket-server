/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../../utils/asyncHandler";
import { sendResponse } from "../../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthService } from "./auth.service";
import AppError from "../../../errorHelpers/AppError";
import { setCookie } from "../../../utils/setCookie";
import { createUserToken } from "../../../utils/userToken";
import { envVars } from "../../../../config/env";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";
//custom email login
// const credentialsLogin = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     // const result = await UserServices.createUser(req.body);
//     const loginInfo = await AuthService.credentialsLogin(req.body);
//     // res.cookie("accessToken", loginInfo.accessToken, {
//     //   httpOnly: true,
//     //   secure: false,
//     // });
//     // res.cookie("refreshToken", loginInfo.refreshToken, {
//     //   httpOnly: true,
//     //   secure: false,
//     // });

//     setCookie(res, loginInfo);

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "User login successfully",
//       data: loginInfo,
//     });
//   }
// );

const credentialsLogin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        return next(new AppError(httpStatus.BAD_REQUEST, err.message));
      }
      if (!user) {
        return next(new AppError(httpStatus.BAD_REQUEST, info.message));
      }
      const userToken = createUserToken(user);

      // delete user.toObject().password;
      const { password: pass, ...rest } = user.toObject();
      setCookie(res, userToken);

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User login successfully",
        data: {
          accessToken: userToken.accessToken,
          refreshToken: userToken.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);

    //
    // res.cookie("accessToken", loginInfo.accessToken, {
    //   httpOnly: true,
    //   secure: false,
    // });
    // res.cookie("refreshToken", loginInfo.refreshToken, {
    //   httpOnly: true,
    //   secure: false,
    // });
  }
);
const newAccessToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // const result = await UserServices.createUser(req.body);
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(httpStatus.BAD_REQUEST, "Refresh token not found");
    }

    const tokenInfo = await AuthService.newAccessToken(refreshToken as string);
    setCookie(res, tokenInfo);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "New access token successfully",
      data: tokenInfo,
    });
  }
);
const logOut = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "logout successfully",
      data: null,
    });
  }
);

const setPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword;
    const decodedToken = req.user as JwtPayload;

    const result = await AuthService.setPassword(
      decodedToken.userId,
      newPassword
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password set successfully",
      data: null,
    });
  }
);
const changePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;
    const result = await AuthService.changePassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password reset successfully",
      data: null,
    });
  }
);
const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    await AuthService.resetPassword(req.body, decodedToken as JwtPayload);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password reset successfully",
      data: null,
    });
  }
);

const forgetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    await AuthService.forgetPassword(email);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Email Sent Successfully",
      data: null,
    });
  }
);

const googleCallBack = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";
    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    const user = req.user;
    // console.log(user, "user");

    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    }

    const token = createUserToken(user);
    setCookie(res, token);
    // sendResponse(res, {
    //   statusCode: httpStatus.OK,
    //   success: true,
    //   message: "Password reset successfully",
    //   data: null,
    // });
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);

export const AuthControllers = {
  credentialsLogin,
  newAccessToken,
  logOut,
  resetPassword,
  googleCallBack,
  changePassword,
  setPassword,
  forgetPassword,
};

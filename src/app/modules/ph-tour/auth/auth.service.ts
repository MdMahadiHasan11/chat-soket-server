/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IAuthProvider, isActive, IUser } from "../user/user.interface";
import httpStatus from "http-status-codes";
import AppError from "../../../errorHelpers/AppError";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import {
  createNewAccessTokenWithRefreshToken,
  createUserToken,
} from "../../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../../../config/env";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../../utils/sendEmail";
const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const isExist = await User.findOne({ email });
  if (!isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isExist?.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password does not match");
  }

  //   const jwtPayload = {
  //     userId: isExist._id,
  //     email: isExist.email,
  //     role: isExist.role,
  //   };
  //   const accessToken = generateToken(
  //     jwtPayload,
  //     envVars.JWT_ACCESS_SECRET,
  //     envVars.JWT_ACCESS_EXPIRES
  //   );

  //   const refreshToken = generateToken(
  //     jwtPayload,
  //     envVars.JWT_REFRESH_SECRET,
  //     envVars.JWT_REFRESH_EXPIRES
  //   );

  const userToken = createUserToken(isExist);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = isExist.toObject();

  return {
    accessToken: userToken.accessToken,
    refreshToken: userToken.refreshToken,
    user: rest,
  };
};

const newAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findOne({ _id: decodedToken.userId });

  const isOldPasswordMatched = await bcryptjs.compare(
    oldPassword as string,
    user!.password as string
  );
  if (!isOldPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Old password does not match");
  }
  user!.password = await bcryptjs.hash(
    newPassword as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  user!.save();
};
const setPassword = async (userId: string, newPassword: string) => {
  const user = await User.findOne({ _id: userId });

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }

  if (user.password && user.auths.some((auth) => auth.provider === "google")) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password already set");
  }

  const hasPassword = await bcryptjs.hash(
    newPassword as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const credentialsLogin: IAuthProvider = {
    provider: "credentials",
    providerId: user.email as string,
  };
  const auths: IAuthProvider[] = [...user.auths, credentialsLogin];
  user.password = hasPassword;
  user.auths = auths;
  await user.save();
};
const forgetPassword = async (email: string) => {
  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }
  if (!isUserExist.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
  }
  if (
    isUserExist.isActive === isActive.BLOCKED ||
    isUserExist.isActive === isActive.INACTIVE
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User is ${isUserExist.isActive}`
    );
  }
  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  //token create
  const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
    expiresIn: "5m",
  });

  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;

  sendEmail({
    to: isUserExist.email,
    subject: "Password Reset",
    templateName: "forgetPassword",
    templateData: {
      name: isUserExist.name,
      resetUILink,
    },
  });

  /**
   * http://localhost:5173/reset-password?id=687f310c724151eb2fcf0c41&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODdmMzEwYzcyNDE1MWViMmZjZjBjNDEiLCJlbWFpbCI6InNhbWluaXNyYXI2QGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzUzMTY2MTM3LCJleHAiOjE3NTMxNjY3Mzd9.LQgXBmyBpEPpAQyPjDNPL4m2xLF4XomfUPfoxeG0MKg
   */
};
const resetPassword = async (
  payload: Record<string, any>,
  decodedToken: JwtPayload
) => {
  if (payload.id !== decodedToken.userId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Unauthorized");
  }

  const isUserExist = await User.findById(decodedToken.userId);
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }
  const hashedPassword = await bcryptjs.hash(
    payload.newPassword as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  isUserExist.password = hashedPassword;
  await isUserExist.save();
};

export const AuthService = {
  credentialsLogin,
  newAccessToken,
  changePassword,
  setPassword,
  forgetPassword,
  resetPassword,
};

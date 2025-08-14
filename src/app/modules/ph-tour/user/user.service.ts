import AppError from "../../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { deleteImageFromCLoudinary } from "../../../../config/cloudinary.config";
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  const isExist = await User.findOne({ email });
  if (isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exist");
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  //   const isPasswordMatched = await bcryptjs.compare(
  //     password as string,
  //     hashedPassword
  //   );
  //   if (!isPasswordMatched) {
  //     throw new AppError(httpStatus.BAD_REQUEST, "Password does not match");
  //   }
  //   console.log(isPasswordMatched);

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  //name
  //phone
  //address
  //password
  //admin -> role,isDeleted

  //no promote superAdmin

  //user

  if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
    if (userId !== decodedToken.userId) {
      throw new AppError(401, "You are not authorized ,id not match");
    }
  }

  const isExist = await User.findOne({ _id: userId });
  if (!isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }

  if (decodedToken.role === Role.ADMIN && isExist.role === Role.SUPER_ADMIN) {
    throw new AppError(401, "You are not authorized");
  }
  // if (payload.role) {
  //   if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
  //     throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  //   }

  //   // if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
  //   //     throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  //   // }
  // }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to update role"
      );
    }
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You are not authorized to update role"
      );
    }
    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You are not authorized to promote superAdmin"
      );
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  // if (payload.password) {
  //   payload.password = await bcryptjs.hash(
  //     payload.password as string,
  //     Number(envVars.BCRYPT_SALT_ROUND)
  //   );
  // }

  const user = await User.findOneAndUpdate({ _id: userId }, payload, {
    new: true,
    runValidators: true,
  });
  if (payload.picture && isExist.picture) {
    await deleteImageFromCLoudinary(isExist.picture);
  }
  return user;
};

const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

const getMe = async (userId: string) => {
  // console.log(userId);
  const user = await User.findOne({ _id: userId });
  // const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user.toObject();
  return {
    data: rest,
    // meta: {
    //   total: totalUsers,
    // },
  };
};
const getSingleUser = async (id: string) => {
  const user = await User.findById(id).select("-password");
  return {
    data: user,
  };
};

export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
  getMe,
  getSingleUser,
};

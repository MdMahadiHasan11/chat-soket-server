/* eslint-disable no-console */
import { envVars } from "../../config/env";
import {
  IAuthProvider,
  IUser,
  Role,
} from "../modules/ph-tour/user/user.interface";
import { User } from "../modules/ph-tour/user/user.model";
import bcryptjs from "bcryptjs";
export const seedSuperAdmin = async () => {
  try {
    const isSuperAdmin = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });
    if (isSuperAdmin) {
      console.log("Super Admin all ready exist");
      return;
    }
    console.log("Try to creating super admin...");

    const hashedPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Super Admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      isVerified: true,
      auths: [authProvider],
    };
    const superAdmin = await User.create(payload);
    console.log("Super Admin created successfully", superAdmin);
  } catch (error) {
    console.log(error);
  }
};

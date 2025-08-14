/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../app/modules/ph-tour/user/user.model";
import { isActive, Role } from "../app/modules/ph-tour/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";
import AppError from "../app/errorHelpers/AppError";
import httpStatus from "http-status-codes";
//-------------------------------------------email auth start --------------
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done: any) => {
      try {
        const isExistUser = await User.findOne({ email });
        if (!isExistUser) {
          return done(null, false, {
            message: "User not found and user not exist",
          });
        }

        // if (!isExistUser.isVerified) {
        //   // throw new AppError(
        //   //   httpStatus.BAD_REQUEST,
        //   //   "This User is not verified"
        //   // );
        //   done(null, false, {
        //     message: "This User is not verified",
        //   });
        // }

        if (
          isExistUser.isActive === isActive.BLOCKED ||
          isExistUser.isActive === isActive.INACTIVE
        ) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            "This User can  blocked or inactive"
          );
          // done(null, false, {
          //   message: "This User can  blocked or inactive",
          // });
        }
        if (isExistUser.isDeleted) {
          // throw new AppError(httpStatus.BAD_REQUEST, "This User is deleted");
          return done(null, false, {
            message: "This User is deleted",
          });
        }

        const isGoogleAuth = isExistUser.auths.find(
          (auth) => auth.provider === "google"
        );
        if (isGoogleAuth && !isExistUser.password) {
          return done(null, false, {
            message: "Login with Google or set password",
          });
        }

        const isPasswordMatched = await bcryptjs.compare(
          password as string,
          isExistUser?.password as string
        );
        if (!isPasswordMatched) {
          return done(null, false, { message: "Password does not match" });
        }

        return done(null, isExistUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

//-------------------------------------------google auth start --------------

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLINT_ID,
      clientSecret: envVars.GOOGLE_CLINT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const email = profile.emails![0].value;
        if (!email) {
          return done(null, false, { message: "Email not found" });
        }
        let user = await User.findOne({ email });

        // if (user && !user.isVerified) {
        //   // throw new AppError(
        //   //   httpStatus.BAD_REQUEST,
        //   //   "This User is not verified"
        //   // );
        //   return done(null, false, {
        //     message: "This User is not verified",
        //   });
        // }

        if (
          user &&
          (user.isActive === isActive.BLOCKED ||
            user.isActive === isActive.INACTIVE)
        ) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            "This User can  blocked or inactive"
          );
          // done(null, false, {
          //   message: "This User can  blocked or inactive",
          // });
        }
        if (user && user.isDeleted) {
          // throw new AppError(httpStatus.BAD_REQUEST, "This User is deleted");
          return done(null, false, {
            message: "This User is deleted",
          });
        }
        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }

        if (user) {
          return done(null, user);
        }
      } catch (error) {
        // console.log("error in passport", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});
passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

//FRONTEND URL from LOGIN REQUEST  IN backend url

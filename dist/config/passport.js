"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const env_1 = require("./env");
const user_model_1 = require("../app/modules/ph-tour/user/user.model");
const user_interface_1 = require("../app/modules/ph-tour/user/user.interface");
const passport_local_1 = require("passport-local");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const AppError_1 = __importDefault(require("../app/errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
//-------------------------------------------email auth start --------------
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isExistUser = yield user_model_1.User.findOne({ email });
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
        if (isExistUser.isActive === user_interface_1.isActive.BLOCKED ||
            isExistUser.isActive === user_interface_1.isActive.INACTIVE) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "This User can  blocked or inactive");
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
        const isGoogleAuth = isExistUser.auths.find((auth) => auth.provider === "google");
        if (isGoogleAuth && !isExistUser.password) {
            return done(null, false, {
                message: "Login with Google or set password",
            });
        }
        const isPasswordMatched = yield bcryptjs_1.default.compare(password, isExistUser === null || isExistUser === void 0 ? void 0 : isExistUser.password);
        if (!isPasswordMatched) {
            return done(null, false, { message: "Password does not match" });
        }
        return done(null, isExistUser);
    }
    catch (error) {
        return done(error);
    }
})));
//-------------------------------------------google auth start --------------
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.envVars.GOOGLE_CLINT_ID,
    clientSecret: env_1.envVars.GOOGLE_CLINT_SECRET,
    callbackURL: env_1.envVars.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const email = profile.emails[0].value;
        if (!email) {
            return done(null, false, { message: "Email not found" });
        }
        let user = yield user_model_1.User.findOne({ email });
        // if (user && !user.isVerified) {
        //   // throw new AppError(
        //   //   httpStatus.BAD_REQUEST,
        //   //   "This User is not verified"
        //   // );
        //   return done(null, false, {
        //     message: "This User is not verified",
        //   });
        // }
        if (user &&
            (user.isActive === user_interface_1.isActive.BLOCKED ||
                user.isActive === user_interface_1.isActive.INACTIVE)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "This User can  blocked or inactive");
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
            user = yield user_model_1.User.create({
                email,
                name: profile.displayName,
                picture: (_a = profile.photos) === null || _a === void 0 ? void 0 : _a[0].value,
                role: user_interface_1.Role.USER,
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
    }
    catch (error) {
        // console.log("error in passport", error);
        return done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
//FRONTEND URL from LOGIN REQUEST  IN backend url

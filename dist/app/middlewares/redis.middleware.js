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
exports.cacheMiddleware = void 0;
const crypto_1 = __importDefault(require("crypto"));
const redis_config_1 = __importDefault(require("../../config/redis.config"));
// import redisClient from "../../config/redis";
const generateCacheKey = (req, keyPrefix) => {
    const { method, originalUrl, query } = req;
    const baseKey = `${keyPrefix}:${method}:${originalUrl}`;
    // Hash query object for fixed-length key
    const queryHash = crypto_1.default
        .createHash("md5")
        .update(JSON.stringify(query))
        .digest("hex");
    return `${baseKey}:${queryHash}`;
};
const cacheMiddleware = (keyPrefix, ttlSeconds = 300) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const key = generateCacheKey(req, keyPrefix);
            const cachedData = yield redis_config_1.default.get(key);
            console.log("before cache middleware");
            if (cachedData) {
                return res.status(200).json(JSON.parse(cachedData));
            }
            console.log("after cache middleware");
            // Override res.json to cache response
            const originalJson = res.json.bind(res);
            res.json = (body) => {
                redis_config_1.default
                    .setEx(key, ttlSeconds, JSON.stringify(body))
                    .catch(console.error);
                return originalJson(body);
            };
            next();
        }
        catch (error) {
            console.error("Cache middleware error:", error);
            next();
        }
    });
};
exports.cacheMiddleware = cacheMiddleware;
/*main hp-tour
await redisClient.set(redisKey, otp, {
  expiration: {
    type: "EX",
    value: OTP_EXPIRATION,
  },
});
//
//
//
/*
import {
  cacheMiddleware,
  CACHE_KEYS,
  setCache,
  getCache,
  deleteCacheByPrefix,
  existsCache
} from "./cacheSystem";

// ১. GET route এ cache middleware ব্যবহার
router.get(
  "/all-users",
  cacheMiddleware(CACHE_KEYS.USER_LIST, 600), // ১০ মিনিট cache
  UserControllers.getAllUsers
);

// ২. ডেটা update/delete এর পর cache invalidate করতে
await deleteCacheByPrefix(CACHE_KEYS.USER_LIST);

// ৩. ম্যানুয়ালি cache সেট করতে চাইলে
const users = await UserService.getAllUsersFromDB();
await setCache(CACHE_KEYS.USER_LIST, users, 600);

// ৪. ম্যানুয়ালি cache থেকে ডেটা নিতে চাইলে
const cachedUsers = await getCache<UserType[]>(CACHE_KEYS.USER_LIST);
if (cachedUsers) {
  return res.json(cachedUsers);
}

// ৫. Cache key আছে কিনা চেক করতে
const exists = await existsCache(CACHE_KEYS.USER_LIST);
if (exists) {
  console.log("Cache found");
} else {
  console.log("No cache");
}

*/

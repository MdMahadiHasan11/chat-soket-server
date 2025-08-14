/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import redisClient from "../../config/redis.config";
// import redisClient from "../../config/redis";

const generateCacheKey = (req: Request, keyPrefix: string): string => {
  const { method, originalUrl, query } = req;
  const baseKey = `${keyPrefix}:${method}:${originalUrl}`;

  // Hash query object for fixed-length key
  const queryHash = crypto
    .createHash("md5")
    .update(JSON.stringify(query))
    .digest("hex");

  return `${baseKey}:${queryHash}`;
};

export const cacheMiddleware = (keyPrefix: string, ttlSeconds = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = generateCacheKey(req, keyPrefix);
      const cachedData = await redisClient.get(key);
      console.log("before cache middleware");
      if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
      }
      console.log("after cache middleware");

      // Override res.json to cache response
      const originalJson = res.json.bind(res);
      res.json = (body: any) => {
        redisClient
          .setEx(key, ttlSeconds, JSON.stringify(body))
          .catch(console.error);
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error("Cache middleware error:", error);
      next();
    }
  };
};

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

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { createClient } from "redis";
import { envVars } from "./env"; // env ফাইল থেকে কনফিগ পড়া

// const redisClient = createClient({
//   url: envVars.REDIS_URL || "redis://localhost:6379",
// });
export const redisClient = createClient({
  username: envVars.REDIS_USERNAME,
  password: envVars.REDIS_PASSWORD,
  socket: {
    host: envVars.REDIS_HOST,
    port: Number(envVars.REDIS_PORT),
  },
});

redisClient.on("error", (err: any) => {
  console.error("❌ Redis Client Error", err);
});

// redisClient.on("connect", () => {
//   console.log("✅ Redis connected successfully");
// });

// (async () => {
//   await redisClient.connect();
// })();

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("✅ Redis connected successfully");
  }
};

export default redisClient;

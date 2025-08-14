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
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redisClient = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
const redis_1 = require("redis");
const env_1 = require("./env"); // env ফাইল থেকে কনফিগ পড়া
// const redisClient = createClient({
//   url: envVars.REDIS_URL || "redis://localhost:6379",
// });
exports.redisClient = (0, redis_1.createClient)({
    username: env_1.envVars.REDIS_USERNAME,
    password: env_1.envVars.REDIS_PASSWORD,
    socket: {
        host: env_1.envVars.REDIS_HOST,
        port: Number(env_1.envVars.REDIS_PORT),
    },
});
exports.redisClient.on("error", (err) => {
    console.error("❌ Redis Client Error", err);
});
// redisClient.on("connect", () => {
//   console.log("✅ Redis connected successfully");
// });
// (async () => {
//   await redisClient.connect();
// })();
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!exports.redisClient.isOpen) {
        yield exports.redisClient.connect();
        console.log("✅ Redis connected successfully");
    }
});
exports.connectRedis = connectRedis;
exports.default = exports.redisClient;

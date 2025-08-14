"use strict";
/* eslint-disable no-console */
// import redisClient from "../../config/redis";
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
exports.existsCache = exports.deleteCacheByPrefix = exports.deleteCache = exports.getCache = exports.setCache = void 0;
const redis_config_1 = __importDefault(require("../../config/redis.config"));
// Set cache with TTL (default 1 hour)
const setCache = (key_1, value_1, ...args_1) => __awaiter(void 0, [key_1, value_1, ...args_1], void 0, function* (key, value, ttlSeconds = 3600) {
    try {
        yield redis_config_1.default.setEx(key, ttlSeconds, JSON.stringify(value));
    }
    catch (error) {
        console.error(`[Redis] Failed to set cache key: ${key}`, error);
    }
});
exports.setCache = setCache;
// Get cache
const getCache = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield redis_config_1.default.get(key);
        return data ? JSON.parse(data) : null;
    }
    catch (error) {
        console.error(`[Redis] Failed to get cache key: ${key}`, error);
        return null;
    }
});
exports.getCache = getCache;
// Delete cache key
const deleteCache = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redis_config_1.default.del(key);
    }
    catch (error) {
        console.error(`[Redis] Failed to delete cache key: ${key}`, error);
    }
});
exports.deleteCache = deleteCache;
// Delete cache by prefix (useful for invalidating paginated cache)
const deleteCacheByPrefix = (prefix) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const keys = yield redis_config_1.default.keys(`${prefix}*`);
        if (keys.length > 0) {
            yield redis_config_1.default.del(keys);
        }
    }
    catch (error) {
        console.error(`[Redis] Failed to delete keys with prefix: ${prefix}`, error);
    }
});
exports.deleteCacheByPrefix = deleteCacheByPrefix;
// Check if key exists
const existsCache = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exists = yield redis_config_1.default.exists(key);
        return exists === 1;
    }
    catch (error) {
        console.error(`[Redis] Failed to check existence of key: ${key}`, error);
        return false;
    }
});
exports.existsCache = existsCache;

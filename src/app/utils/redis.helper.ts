/* eslint-disable no-console */
// import redisClient from "../../config/redis";

import redisClient from "../../config/redis.config";

// Set cache with TTL (default 1 hour)
export const setCache = async (
  key: string,
  value: unknown,
  ttlSeconds = 3600
): Promise<void> => {
  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
  } catch (error) {
    console.error(`[Redis] Failed to set cache key: ${key}`, error);
  }
};

// Get cache
export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redisClient.get(key);
    return data ? (JSON.parse(data) as T) : null;
  } catch (error) {
    console.error(`[Redis] Failed to get cache key: ${key}`, error);
    return null;
  }
};

// Delete cache key
export const deleteCache = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error(`[Redis] Failed to delete cache key: ${key}`, error);
  }
};

// Delete cache by prefix (useful for invalidating paginated cache)
export const deleteCacheByPrefix = async (prefix: string): Promise<void> => {
  try {
    const keys = await redisClient.keys(`${prefix}*`);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error(
      `[Redis] Failed to delete keys with prefix: ${prefix}`,
      error
    );
  }
};

// Check if key exists
export const existsCache = async (key: string): Promise<boolean> => {
  try {
    const exists = await redisClient.exists(key);
    return exists === 1;
  } catch (error) {
    console.error(`[Redis] Failed to check existence of key: ${key}`, error);
    return false;
  }
};

// src/config/redis.ts
import { Redis } from "@upstash/redis";

// Trim any extra spaces or quotes
const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.replace(/^"|"$/g, '').trim();
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.replace(/^"|"$/g, '').trim();

console.log('🔍 Redis URL:', redisUrl);
console.log('🔍 Redis Token:', redisToken?.substring(0, 20) + '...');

export const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});

// Test connection immediately
(async () => {
  try {
    await redis.set('test-connection', 'working', { ex: 10 });
    const test = await redis.get('test-connection');
    console.log('✅ Redis connection successful! Test value:', test);
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
  }
})();

export class RedisService {
  static readonly DEFAULT_TTL = 3600; // 1 hour

  static async set<T>(
    key: string,
    value: T,
    expireSeconds: number = this.DEFAULT_TTL
  ): Promise<void> {
    try {
      console.log(`📝 Setting Redis key: ${key}, expire: ${expireSeconds}s`);
      
      await redis.set(key, JSON.stringify(value), {
        ex: expireSeconds
      });
      console.log(`✅ Redis set successful for key: ${key}`);
    } catch (error) {
      console.error(`❌ Redis set error for key ${key}:`, error);
      throw error;
    }
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      console.log(`📖 Getting Redis key: ${key}`);
      const value = await redis.get<string>(key);
      
      if (!value) {
        console.log(`❌ Key not found: ${key}`);
        return null;
      }
      
      console.log(`✅ Redis get successful for key: ${key}`);
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`❌ Redis get error for key ${key}:`, error);
      return null;
    }
  }

  static async deleteCache(key: string): Promise<void> {
    try {
      console.log(`🗑️ Deleting Redis key: ${key}`);
      await redis.del(key);
      console.log(`✅ Redis delete successful for key: ${key}`);
    } catch (error) {
      console.error(`❌ Redis delete error for key ${key}:`, error);
    }
  }

  static async clearCachePattern(pattern: string): Promise<void> {
    try {
      console.log(`🗑️ Clearing Redis keys with pattern: ${pattern}`);
      const keys = await redis.keys(pattern);
      
      if (keys.length > 0) {
        await redis.del(...keys);
        console.log(`✅ Cleared ${keys.length} keys with pattern: ${pattern}`);
      } else {
        console.log(`ℹ️ No keys found with pattern: ${pattern}`);
      }
    } catch (error) {
      console.error(`❌ Failed to clear cache with pattern ${pattern}:`, error);
    }
  }

  static async clearAllCache(): Promise<void> {
    try {
      console.log(`🗑️ Clearing all Redis cache`);
      const keys = await redis.keys('*');
      
      if (keys.length > 0) {
        await redis.del(...keys);
        console.log(`✅ Cleared ${keys.length} keys`);
      } else {
        console.log(`ℹ️ No keys found to clear`);
      }
    } catch (error) {
      console.error('❌ Failed to clear all cache:', error);
    }
  }

  static async exists(key: string): Promise<boolean> {
    try {
      const exists = await redis.exists(key);
      return exists === 1;
    } catch (error) {
      console.error(`❌ Redis exists error for key ${key}:`, error);
      return false;
    }
  }

  static async getTTL(key: string): Promise<number> {
    try {
      const ttl = await redis.ttl(key);
      return ttl;
    } catch (error) {
      console.error(`❌ Redis TTL error for key ${key}:`, error);
      return -1;
    }
  }

  static async expire(key: string, seconds: number): Promise<void> {
    try {
      await redis.expire(key, seconds);
      console.log(`✅ Redis expire successful for key: ${key}, TTL: ${seconds}s`);
    } catch (error) {
      console.error(`❌ Redis expire error for key ${key}:`, error);
    }
  }
}
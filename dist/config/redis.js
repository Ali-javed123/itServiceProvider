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
    }
    catch (error) {
        console.error('❌ Redis connection failed:', error);
    }
})();
export class RedisService {
    static async set(key, value, expireSeconds) {
        try {
            console.log(`📝 Setting Redis key: ${key}, value: ${value}, expire: ${expireSeconds}s`);
            if (expireSeconds) {
                await redis.set(key, JSON.stringify(value), {
                    ex: expireSeconds
                });
            }
            else {
                await redis.set(key, JSON.stringify(value));
            }
            console.log(`✅ Redis set successful for key: ${key}`);
        }
        catch (error) {
            console.error(`❌ Redis set error for key ${key}:`, error);
            throw error;
        }
    }
    static async get(key) {
        try {
            console.log(`📖 Getting Redis key: ${key}`);
            const value = await redis.get(key);
            console.log(`📖 Redis get result for ${key}:`, value);
            if (!value)
                return null;
            return JSON.parse(value);
        }
        catch (error) {
            console.error(`❌ Redis get error for key ${key}:`, error);
            return null;
        }
    }
    static async remove(key) {
        try {
            console.log(`🗑️ Deleting Redis key: ${key}`);
            await redis.del(key);
            console.log(`✅ Redis delete successful for key: ${key}`);
        }
        catch (error) {
            console.error(`❌ Redis delete error for key ${key}:`, error);
        }
    }
}
//# sourceMappingURL=redis.js.map
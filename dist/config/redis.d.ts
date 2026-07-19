import { Redis } from "@upstash/redis";
export declare const redis: Redis;
export declare class RedisService {
    static set<T>(key: string, value: T, expireSeconds?: number): Promise<void>;
    static get<T>(key: string): Promise<T | null>;
    static remove(key: string): Promise<void>;
}
//# sourceMappingURL=redis.d.ts.map
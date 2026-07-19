import { redis } from "./redis.js";
console.log("Redis file loaded");
async function testRedis() {
    try {
        await redis.set("test-key", "123456", {
            ex: 300,
        });
        console.log("SET Success");
        const value = await redis.get("test-key");
        console.log("GET:", value);
    }
    catch (err) {
        console.error("Redis Error:", err);
    }
}
testRedis();
//# sourceMappingURL=rediss.js.map
import redisClient from "../config/redis.js";
export const helloRedis = async (req, res) => {
  try {
    const cacheKey = "hello";

    console.log("---- Request ----");

    const cachedData = await redisClient.get(cacheKey);
    console.log("Cached Data:", cachedData);

    if (cachedData !== null) {
      console.log("Cache HIT");
      return res.json({
        source: "redis",
        data: cachedData,
      });
    }

    console.log("Cache MISS");

    const message = "Hello Harsh 🚀 Learning Redis";

    await redisClient.set(cacheKey, message);  // ⚠ NO setEx

    console.log("Saved to Redis");

    res.json({
      source: "Server",
      data: message,
    });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};
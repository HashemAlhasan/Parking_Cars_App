import { rateLimit } from "express-rate-limit";
import redis from 'redis'
import { RateLimiterRedis } from 'rate-limiter-flexible'



// Local rate Limit
export const rateLimitRequest = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,        // 24h 
    max: 50,
    message: 'You have exceeded the 50 request in 24 hrs limit!',
    standardHeaders: true,
    legacyHeaders: false
});



// Distributed rate Limit

const redisClient = redis.createClient();


export const distributedLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "rateLimiter",
    points: 1000, // Max requests
    duration: 60,// Time Window in seconds
})



export const distributedRateLimitMiddleware = (req, res, next) => {
    const clientIP = req.ip

    distributedLimiter.consume(clientIP).then(() => next()).catch(() => { return res.status(429).json({ error: 'Too many requests' }); })
}
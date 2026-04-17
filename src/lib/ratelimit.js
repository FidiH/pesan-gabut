import { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } from "$env/static/private";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, "2 m"), // 1 request per 2 menit per IP
  analytics: true,
});
import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const bookingQueue = new Queue(
  "booking-queue",
  {
    connection: redisConnection,
  }
);
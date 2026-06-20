import { QueueEvents } from "bullmq";
import { redisConnection } from "../config/redis";

export const bookingQueueEvents =
  new QueueEvents(
    "booking-queue",
    {
      connection: redisConnection,
    }
  );
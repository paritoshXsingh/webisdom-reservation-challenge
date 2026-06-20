import { Response } from "express";

import { bookingQueue } from "../queues/bookingQueue";
import { bookingQueueEvents } from "../queues/queueEvents";

import { AuthRequest } from "../middleware/authMiddleware";

export const createReservation =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const { slotId, quantity } =
        req.body;

      const userId =
        req.user?.id;

      const job =
        await bookingQueue.add(
          "create-booking",
          {
            userId,
            slotId,
            quantity,
          }
        );

      const result =
        await job.waitUntilFinished(
          bookingQueueEvents
        );

      return res.status(201).json(
        result
      );
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };
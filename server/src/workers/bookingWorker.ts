import { Worker } from "bullmq";
import mongoose from "mongoose";

import { redisConnection } from "../config/redis";

import TimeSlot from "../models/TimeSlot";
import Reservation from "../models/Reservation";

import { BookingJobData } from "../types/booking";

export const bookingWorker = new Worker(
  "booking-queue",

  async (job) => {
    const { userId, slotId, quantity } = job.data as BookingJobData;

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const slot = await TimeSlot.findById(slotId).session(session);

      if (!slot) {
        throw new Error("Time slot not found");
      }

      if (slot.availableTickets < quantity) {
        throw new Error("Not enough tickets available");
      }

      slot.availableTickets -= quantity;

      await slot.save({
        session,
      });

      const reservation = await Reservation.create(
        [
          {
            userId,
            slotId,
            quantity,
          },
        ],
        {
          session,
        },
      );

      await session.commitTransaction();

      return {
        success: true,
        reservation: reservation[0],
      };
    } catch (error) {
      await session.abortTransaction();

      throw error;
    } finally {
      session.endSession();
    }
  },

  {
    connection: redisConnection,
  },
);

import { Response } from "express";

import { bookingQueue } from "../queues/bookingQueue";
import { bookingQueueEvents } from "../queues/queueEvents";

import { AuthRequest } from "../middleware/authMiddleware";

import Reservation from "../models/Reservation";
import TimeSlot from "../models/TimeSlot";
import mongoose from "mongoose";

export const createReservation = async (req: AuthRequest, res: Response) => {
  try {
    const { slotId, quantity } = req.body;

    const userId = req.user?.id;

    const job = await bookingQueue.add("create-booking", {
      userId,
      slotId,
      quantity,
    });

    const result = await job.waitUntilFinished(bookingQueueEvents);

    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelReservation = async (req: AuthRequest, res: Response) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const reservation = await Reservation.findById(req.params.id).session(
      session,
    );

    if (!reservation) {
      throw new Error("Reservation not found");
    }

    // IDOR PROTECTION
    if (reservation.userId.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (reservation.status === "CANCELLED") {
      throw new Error("Reservation already cancelled");
    }

    const slot = await TimeSlot.findById(reservation.slotId).session(session);

    if (!slot) {
      throw new Error("Slot not found");
    }

    slot.availableTickets += reservation.quantity;

    reservation.status = "CANCELLED";

    await slot.save({
      session,
    });

    await reservation.save({
      session,
    });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Reservation cancelled",
    });
  } catch (error: any) {
    await session.abortTransaction();

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

import { Request, Response } from "express";

import TimeSlot from "../models/TimeSlot";
import Site from "../models/Site";

export const getCapacityDashboard = async (req: Request, res: Response) => {
  try {
    const slots = await TimeSlot.find().populate("siteId", "name").lean();

    const dashboardData = slots.map((slot: any) => ({
      id: slot._id,
      site: slot.siteId?.name,
      date: slot.date,
      startTime: slot.startTime,
      capacity: slot.capacity,
      availableTickets: slot.availableTickets,
      bookedTickets: slot.capacity - slot.availableTickets,
    }));

    return res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

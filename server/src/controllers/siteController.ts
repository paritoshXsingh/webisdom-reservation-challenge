import { Request, Response } from "express";
import Site from "../models/Site";
import TimeSlot from "../models/TimeSlot";

export const getSites = async (req: Request, res: Response) => {
  try {
    const sites = await Site.find();

    res.status(200).json({
      success: true,
      data: sites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch sites",
    });
  }
};

export const getSlotsBySite = async (req: Request, res: Response) => {
  try {
    const slots = await TimeSlot.find({
      siteId: req.params.siteId,
    });

    res.status(200).json({
      success: true,
      data: slots,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch slots",
    });
  }
};

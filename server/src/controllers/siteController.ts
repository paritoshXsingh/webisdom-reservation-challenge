import { Request, Response } from "express";
import Site from "../models/Site";
import TimeSlot from "../models/TimeSlot";

export const getSites = async (req: Request, res: Response) => {
  try {
    const sites = await Site.find().lean();

    const enrichedSites = await Promise.all(
      sites.map(async (site) => {
        const slotCount = await TimeSlot.countDocuments({
          siteId: site._id,
        });

        return {
          ...site,
          slotCount,
        };
      }),
    );

    res.status(200).json({
      success: true,
      data: enrichedSites,
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

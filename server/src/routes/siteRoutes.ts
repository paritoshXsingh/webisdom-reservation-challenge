import { Router } from "express";

import { getSites, getSlotsBySite } from "../controllers/siteController";

const router = Router();

router.get("/", getSites);

router.get("/:siteId/slots", getSlotsBySite);

export default router;

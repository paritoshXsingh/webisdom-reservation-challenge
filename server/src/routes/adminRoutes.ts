import { Router } from "express";

import { getCapacityDashboard } from "../controllers/adminController";

import { protect } from "../middleware/authMiddleware";
import { adminOnly } from "../middleware/adminMiddleware";

const router = Router();

router.get("/capacity", protect, adminOnly, getCapacityDashboard);

export default router;

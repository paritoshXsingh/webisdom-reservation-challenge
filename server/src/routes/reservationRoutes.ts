import { Router } from "express";

import { createReservation } from "../controllers/reservationController";

import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/", protect, createReservation);

export default router;

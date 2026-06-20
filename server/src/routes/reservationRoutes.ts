import { Router } from "express";

import {
  createReservation,
  cancelReservation,
} from "../controllers/reservationController";

import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/", protect, createReservation);
router.delete("/:id", protect, cancelReservation);

export default router;

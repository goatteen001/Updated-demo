import express from "express";
import { saveTelemetry } from "../controllers/telemetry.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, saveTelemetry);

export default router;

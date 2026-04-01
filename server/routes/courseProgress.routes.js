import express from "express";
import {
  markMaterialComplete,
  getCourseProgress,
  getMaterialCompletionStatus,
} from "../controllers/courseProgress.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/course-progress/material/complete
router.post("/material/complete", protect, markMaterialComplete);

// GET /api/course-progress/course/:courseId?userId=xxx
router.get("/course/:courseId", protect, getCourseProgress);

// GET /api/course-progress/material/status?userId=xxx&courseId=xxx
router.get("/material/status", protect, getMaterialCompletionStatus);

export default router;

import express from "express";
import { getUserProgress, updateMaterialProgress, computeCourseProgress } from "../controllers/progress.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getUserProgress);
router.post("/material", protect, updateMaterialProgress);
router.post("/course/:courseId/compute", protect, computeCourseProgress);

export default router;

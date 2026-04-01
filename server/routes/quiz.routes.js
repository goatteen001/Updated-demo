import express from "express";
import { getQuizAttempts } from "../controllers/quiz.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getQuizAttempts);

export default router;

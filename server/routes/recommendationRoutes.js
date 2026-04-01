import express from 'express';
import { getRecommendations } from '../controllers/recommendationController.js';

const router = express.Router();

router.get('/:user_id', getRecommendations);

export default router;
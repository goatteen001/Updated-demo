import express from 'express';
import { addTelemetryEvents } from '../controllers/telemetryController.js';

const router = express.Router();

router.post('/', addTelemetryEvents);

export default router;


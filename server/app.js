import express from 'express';
import cors from 'cors';

import interactionRoutes from './routes/interactionRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import telemetryRoutes from './routes/telemetryRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/interactions', interactionRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/telemetry', telemetryRoutes);

export default app;
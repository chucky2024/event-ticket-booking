import express, { json } from 'express';
import helmet from 'helmet';
import eventRoutes from './routes/eventRoutes';
import errorHandler from './middlewares/errorHandler';
import { info } from './utils/logger';

const app = express();

app.use(helmet());
app.use(json());

// Logging middleware
app.use((req, res, next) => {
  info(`${req.method} ${req.url}`);
  next();
});

app.use('/api', eventRoutes);  // This line should work now
app.use(errorHandler);

export default app;
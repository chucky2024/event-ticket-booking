import { Router } from 'express';
const router = Router();  // Make sure this line exists
import { initializeEvent, bookTicket, cancelBooking, getEventStatus } from '../services/EventService';
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});

router.use(apiLimiter);

router.post('/initialize', async (req, res, next) => {
  try {
    const { name, totalTickets } = req.body;
    const event = await initializeEvent(name, totalTickets);
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
});

router.post('/book', async (req, res, next) => {
  try {
    const { eventId, userId } = req.body;
    const booking = await bookTicket(eventId, userId);
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
});

router.post('/cancel', async (req, res, next) => {
  try {
    const { eventId, userId } = req.body;
    const result = await cancelBooking(eventId, userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/status/:eventId', async (req, res, next) => {
  try {
    const status = await getEventStatus(req.params.eventId);
    res.json(status);
  } catch (error) {
    next(error);
  }
});

export default router;  // Make sure you're exporting the router
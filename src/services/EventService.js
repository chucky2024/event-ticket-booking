import { create, findByPk } from '../models/Event';
import { findOne, create as _create, count } from '../models/Booking';
import { ValidationError } from '../utils/errors';
import { sequelize } from '../config/database';

class EventService {
  async initializeEvent(name, totalTickets) {
    if (totalTickets <= 0) {
      throw new ValidationError('Total tickets must be greater than 0');
    }

    return await create({
      name,
      totalTickets,
      availableTickets: totalTickets
    });
  }

  async bookTicket(eventId, userId) {
    const result = await sequelize.transaction(async (t) => {
      const event = await findByPk(eventId, { lock: true, transaction: t });
      
      if (!event) {
        throw new ValidationError('Event not found');
      }

      const existingBooking = await findOne({
        where: { eventId, userId, status: 'CONFIRMED' },
        transaction: t
      });

      if (existingBooking) {
        throw new ValidationError('User already has a booking for this event');
      }

      if (event.availableTickets > 0) {
        await event.decrement('availableTickets', { transaction: t });
        return await _create({
          eventId,
          userId,
          status: 'CONFIRMED'
        }, { transaction: t });
      } else {
        const waitlistPosition = await count({
          where: { eventId, status: 'WAITLISTED' },
          transaction: t
        }) + 1;

        return await _create({
          eventId,
          userId,
          status: 'WAITLISTED',
          waitlistPosition
        }, { transaction: t });
      }
    });

    return result;
  }

  async cancelBooking(eventId, userId) {
    return await sequelize.transaction(async (t) => {
      const booking = await findOne({
        where: { eventId, userId, status: 'CONFIRMED' },
        lock: true,
        transaction: t
      });

      if (!booking) {
        throw new ValidationError('No active booking found');
      }

      await booking.update({ status: 'CANCELLED' }, { transaction: t });
      const event = await findByPk(eventId, { lock: true, transaction: t });
      await event.increment('availableTickets', { transaction: t });

      // Process waiting list
      const nextWaitlisted = await findOne({
        where: { eventId, status: 'WAITLISTED' },
        order: [['waitlistPosition', 'ASC']],
        lock: true,
        transaction: t
      });

      if (nextWaitlisted) {
        await nextWaitlisted.update({
          status: 'CONFIRMED',
          waitlistPosition: null
        }, { transaction: t });
        await event.decrement('availableTickets', { transaction: t });
      }

      return booking;
    });
  }

  async getEventStatus(eventId) {
    const event = await findByPk(eventId);
    if (!event) {
      throw new ValidationError('Event not found');
    }

    const waitlistCount = await count({
      where: { eventId, status: 'WAITLISTED' }
    });

    return {
      eventId: event.id,
      name: event.name,
      availableTickets: event.availableTickets,
      totalTickets: event.totalTickets,
      waitlistCount
    };
  }
}

export default new EventService();
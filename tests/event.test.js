import request from 'supertest';
import app from '../src/app';
import { sync, close } from '../src/config/database';
import Event from '../src/models/Event';
import { findOne } from '../src/models/Booking';

beforeAll(async () => {
  await sync({ force: true });
});

afterAll(async () => {
  await close();
});

describe('Event API', () => {
  let eventId;

  test('should initialize an event', async () => {
    const response = await request(app)
      .post('/api/initialize')
      .send({
        name: 'Test Event',
        totalTickets: 10
      });

    expect(response.status).toBe(201);
    expect(response.body.totalTickets).toBe(10);
    expect(response.body.availableTickets).toBe(10);
    eventId = response.body.id;
  });

  test('should book a ticket', async () => {
    const response = await request(app)
      .post('/api/book')
      .send({
        eventId,
        userId: 'user1'
      });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('CONFIRMED');
  });

  test('should add to waitlist when sold out', async () => {
    // Book all remaining tickets
    for (let i = 0; i < 9; i++) {
      await request(app)
        .post('/api/book')
        .send({
          eventId,
          userId: `user${i + 2}`
        });
    }

    // Try to book when sold out
    const response = await request(app)
      .post('/api/book')
      .send({
        eventId,
        userId: 'waitlistUser'
      });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('WAITLISTED');
    expect(response.body.waitlistPosition).toBe(1);
  });

  test('should cancel booking and assign to waitlisted user', async () => {
    const response = await request(app)
      .post('/api/cancel')
      .send({
        eventId,
        userId: 'user1'
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('CANCELLED');

    // Check if waitlisted user got the ticket
    const waitlistedBooking = await findOne({
      where: { userId: 'waitlistUser' }
    });
    expect(waitlistedBooking.status).toBe('CONFIRMED');
  });

  test('should get event status', async () => {
    const response = await request(app)
      .get(`/api/status/${eventId}`);

    expect(response.status).toBe(200);
    expect(response.body.availableTickets).toBe(0);
    expect(response.body.waitlistCount).toBe(0);
  });
});
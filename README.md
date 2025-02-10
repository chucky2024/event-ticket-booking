# Event Ticket Booking System

A Node.js application for managing event ticket bookings with concurrent request handling and waiting list functionality.

## Features

- Event initialization with configurable tickets
- Ticket booking with concurrent request handling
- Waiting list management
- Ticket cancellation with automatic assignment to waiting list
- Status checking for events
- Rate limiting
- Comprehensive logging
- Database persistence with Postgres
- Full test coverage

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd event-ticket-booking 
```

2. Run Migrations:
```bash
npm run migrate
```
3. Running the Application:

- Development mode:
```bash
npm run dev
```
- Production mode:
```bash
npm start
```

4. Running Tests:
```bash
npm test
```
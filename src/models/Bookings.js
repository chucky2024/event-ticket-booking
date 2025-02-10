import { DataTypes } from 'sequelize';
import { define } from '../config/database';

const Booking = define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  eventId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('CONFIRMED', 'WAITLISTED', 'CANCELLED'),
    defaultValue: 'CONFIRMED'
  },
  waitlistPosition: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
});

export default Booking;
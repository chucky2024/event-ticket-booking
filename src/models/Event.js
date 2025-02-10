import { DataTypes } from 'sequelize';
import { define } from '../config/database';

const Event = define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  totalTickets: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  availableTickets: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default Event;
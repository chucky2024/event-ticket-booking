import { listen } from './app';
import { sync } from './config/database';
import { info, error as _error } from './utils/logger';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sync();
    info('Database synchronized successfully');

    listen(PORT, () => {
      info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    _error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
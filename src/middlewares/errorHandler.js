import errors from '../utils/errors';
const { ValidationError } = errors;
import logger from '../utils/logger';

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: err.message
    });
  }

  return res.status(500).json({
    error: 'Internal Server Error'
  });
};

export default errorHandler;
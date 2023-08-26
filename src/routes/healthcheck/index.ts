import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

const healthcheckRouter = Router();

healthcheckRouter.get('/', async (req, res, next) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
  };

  try {
    res.status(StatusCodes.OK).send(healthcheck).end();
  } catch (error) {
    if (error instanceof Error) {
      healthcheck.message = error.message;
      res.status(StatusCodes.SERVICE_UNAVAILABLE).send(healthcheck).end();
    }
  }
});

export { healthcheckRouter };

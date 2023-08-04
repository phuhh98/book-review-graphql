import express from 'express';
import { applyTerminusGracefullyShutdown, postStartHandler } from './utils';
import { applyRoutes } from './routes';
import { applyMiddlewares } from './middlewares';

export async function bootstrap() {
  const app = express();

  const PORT = parseInt(process.env.SERVER_PORT, 10);

  applyMiddlewares(app);
  await applyRoutes(app);

  const server = app.listen(PORT, postStartHandler);

  applyTerminusGracefullyShutdown(server);
}

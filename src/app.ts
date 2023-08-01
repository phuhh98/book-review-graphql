import './loaders';

import express from 'express';
import cors from 'cors';
import { CORS_OPTIONS } from './utils/cors';
import { createTerminus } from '@godaddy/terminus';
import { ENV_PROD } from './constants';

export async function bootstrap() {
  const app = express();

  const PORT = parseInt(process.env.SERVER_PORT, 10);

  app.use(cors(CORS_OPTIONS));
  app.use(express.json());
  await applyRoutes(app);

  const server = app.listen(PORT, postStartHandler);

  applyTerminusGracefullyShutdown(server);
}

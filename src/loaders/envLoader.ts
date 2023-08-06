import path from 'path';
import * as dotenv from 'dotenv';
import { ENV } from '../constants';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DOCKER: string;
      ENV: string;
      SERVER_PORT: string;
      MONGODB_URL: string;
      MONGODB_USER: string;
      MONGODB_PASSWORD: string;
      MONGODB_DBNAME: string;
      CLUSTER_MODE: 'on' | 'off' | undefined;
      ALLOWED_ORIGINS: string;
      SERVER_URL: string;
    }
  }
}

const envPath = path.resolve(__dirname, '../../.env');
if (process.env.DOCKER !== ENV.IS_DOCKER) dotenv.config({ path: envPath });

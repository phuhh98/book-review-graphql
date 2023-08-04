import path from 'path';
import * as dotenv from 'dotenv';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENV: string;
      SERVER_PORT: string;
      MONGODB_URL: string;
      MONGODB_USER: string;
      MONGODB_PASSWORD: string;
      MONGODB_DBNAME: string;
      CLUSTER_MODE: 'on' | 'off' | undefined;
    }
  }
}

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

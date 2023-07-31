import path from 'path';
import * as dotenv from 'dotenv';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_PORT: string;
    }
  }
}

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

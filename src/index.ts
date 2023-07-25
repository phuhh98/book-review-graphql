import express from 'express';
import { printValue } from '@utils/common';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
    }
  }
}

const PORT = parseInt(process.env.PORT) || 5000;

const app = express();

app.get('/', (req, res) => {
  printValue(10);
  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.info('Server start at port', PORT);
  console.info(`visit http://localhost:${PORT}`);
});

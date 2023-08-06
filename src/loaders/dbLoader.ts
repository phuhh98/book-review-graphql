import mongoose from 'mongoose';
import { ENV } from '../constants';

const { MONGODB_URL, MONGODB_USER, MONGODB_PASSWORD, MONGODB_DBNAME } = process.env;

mongoose
  .connect(MONGODB_URL, {
    user: MONGODB_USER,
    pass: MONGODB_PASSWORD,
    dbName: MONGODB_DBNAME,
  })
  .then(() => {
    console.info('mongoddb connected');
  })
  .catch((e) => {
    console.error('Can not connect to db');
    console.error(e);
    process.exit(1);
  });

mongoose.set('strictQuery', true);

if (process.env.ENV !== ENV.ENV_PROD) {
  mongoose.set('debug', true);
}

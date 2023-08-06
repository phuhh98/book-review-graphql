import { CorsOptions } from 'cors';
import { isJSON } from './validators';

const ALLOWED_ORIGINS =
  process.env.ALLOWED_ORIGINS && isJSON(process.env.ALLOWED_ORIGINS)
    ? Array.from(JSON.parse(process.env.ALLOWED_ORIGINS) as string[])
    : [];

const PORT = parseInt(process.env.SERVER_PORT, 10);

const WHITELIST = [
  `http://localhost:${PORT}`,
  ...ALLOWED_ORIGINS,
  process.env.SERVER_URL,
];

export const CORS_OPTIONS: CorsOptions = {
  origin: (origin, callback) => {
    if (
      WHITELIST.some((allowedMember) => !!origin && allowedMember.includes(origin)) ||
      !origin
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

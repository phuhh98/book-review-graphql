import { CorsOptions } from 'cors';

const PORT = parseInt(process.env.SERVER_PORT, 10);

const WHITELIST = [`http://localhost:${PORT}`];

export const CORS_OPTIONS: CorsOptions = {
  origin: (origin, callback) => {
    if (
      WHITELIST.some(
        (allowedMember) => !!origin && allowedMember.indexOf(origin) !== -1,
      ) ||
      !origin
    ) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
};

export * from './resolvers';

import path from 'path';
import { readFileSync } from 'fs';

export const typeDefs = readFileSync(
  path.resolve(__dirname, './typeDefs.gql'),
  {
    encoding: 'utf-8',
  },
);

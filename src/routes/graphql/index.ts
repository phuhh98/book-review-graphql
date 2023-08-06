import http from 'node:http';
import { Application } from 'express';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import { expressMiddleware } from '@apollo/server/express4';

import { ENV } from '../../constants';

import path from 'path';
import { readFileSync } from 'fs';
import { resolvers } from '../../graphql';

export const typeDefs = readFileSync(path.resolve(__dirname, '../../graphql/typeDefs.gql'), {
  encoding: 'utf-8',
});

export async function getApolloServer(app: Application) {
  const httpServer = http.createServer(app);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginCacheControl({
        // Cache everything for 1 second by default.
        defaultMaxAge: 1,
        // Don't send the `cache-control` response header.
        calculateHttpHeaders: false,
      }),
    ],
    introspection: process.env.ENV !== ENV.ENV_PROD ? true : false,
    includeStacktraceInErrorResponses: process.env.ENV === ENV.ENV_DEV ? true : false,
  });
  await apolloServer.start();
  return apolloServer;
}

export const getApolloMiddleware = async (app: Application) => {
  return expressMiddleware(await getApolloServer(app));
};

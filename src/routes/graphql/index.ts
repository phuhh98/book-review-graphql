import http from 'node:http';
import { Application } from 'express';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';

import { ENV } from '../../constants';

import path from 'path';
import { readFileSync } from 'fs';
import { resolvers } from '../../graphql';

export const typeDefs = readFileSync(
  path.resolve(__dirname, '../../graphql/typeDefs.gql'),
  {
    encoding: 'utf-8',
  },
);

export async function getApolloServer(app: Application) {
  const httpServer = http.createServer(app);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: process.env.ENV !== ENV.ENV_PROD ? true : false,
  });
  await apolloServer.start();
  return apolloServer;
}

export const getApolloMiddleware = async (app: Application) => {
  return expressMiddleware(await getApolloServer(app));
};

import './loaders/envLoader';

import express from 'express';
import cors from 'cors';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import { typeDefs, resolvers } from './graphql';
import { CORS_OPTIONS } from './utils/cors';
import { createTerminus } from '@godaddy/terminus';

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const PORT = parseInt(process.env.SERVER_PORT, 10);

  // Set up Apollo Server
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    // introspection: false,
  });
  await apolloServer.start();

  app.use(cors(CORS_OPTIONS));
  app.use(express.json());
  app.use('/graphql', expressMiddleware(apolloServer));

  const server = app.listen(PORT, () => {
    console.info('Server start at port', PORT);
    console.info(`visit http://localhost:${PORT}`);
  });

  async function onSignal(): Promise<typeof server> {
    console.log('Received kill signal, shutting down gracefully');
    return server.close(() => {
      console.log('Closed out remaining connections');
      process.exit(0);
    });
  }

  createTerminus(server, {
    signals: ['SIGINT', 'SITERM'],
    onSignal,
  });
}

startServer();

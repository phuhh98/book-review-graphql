import { expressMiddleware } from '@apollo/server/express4';
import { Application } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getApolloServer } from './graphql';

export async function applyRoutes(app: Application) {
  const apolloServer = await getApolloServer(app);

  app.use('/graphql', expressMiddleware(apolloServer));

  app.get('/', (_, res) => {
    res.status(StatusCodes.NOT_FOUND).send('This route does not exist');
  });
}

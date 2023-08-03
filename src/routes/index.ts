import { expressMiddleware } from '@apollo/server/express4';
import { Application } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getApolloMiddleware, getApolloServer } from './graphql';

export async function applyRoutes(app: Application) {
  const apolloMidleware = await getApolloMiddleware(app);

  app.use('/graphql', apolloMidleware);

  app.get('/', (_, res) => {
    res.status(StatusCodes.NOT_FOUND).send('This route does not exist');
  });
}

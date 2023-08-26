import { Application } from 'express';
import { StatusCodes } from 'http-status-codes';
import { bookRouter } from './book';
import { genreRouter } from './genre';
import { healthcheckRouter } from './healthcheck';
import { getApolloMiddleware } from './graphql';
import { errorMiddleware } from '../middlewares';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { MEGA_BYTE, REST_PATH } from '../constants';
import { imageRouter } from './image';

export async function applyRoutes(app: Application) {
  const apolloMidleware = await getApolloMiddleware(app);
  const MAX_FILES_PER_UPLOAD = 10;

  app.use(`/${REST_PATH.BOOK}`, bookRouter);
  app.use(`/${REST_PATH.GENRE}`, genreRouter);
  app.use(`/${REST_PATH.IMAGE}`, imageRouter);
  app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 2 * MEGA_BYTE, maxFiles: MAX_FILES_PER_UPLOAD }),
    apolloMidleware,
  );

  app.use('/healthz', healthcheckRouter);

  app.all('*', (_, res) => {
    res.status(StatusCodes.NOT_FOUND).send('This route does not exist');
  });

  app.use(errorMiddleware);
}

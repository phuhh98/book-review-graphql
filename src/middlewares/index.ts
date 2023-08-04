import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { CORS_OPTIONS } from 'src/utils';

export const applyMiddlewares = (app: Application) => {
  app.use(cors(CORS_OPTIONS));
  app.use(express.json());
  app.use(morgan('tiny'));
};

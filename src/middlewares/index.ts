import express, { Application, ErrorRequestHandler } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { CORS_OPTIONS } from '../utils';
import { NextFuncError } from '../types';
import { StatusCodes } from 'http-status-codes';

export const applyMiddlewares = (app: Application) => {
  app.use(cors(CORS_OPTIONS));
  app.use(express.json());
  app.use(morgan('tiny'));
};

export const errorMiddleware: ErrorRequestHandler = (err: NextFuncError, _, res) => {
  res
    .status(Number.isNaN(err.statusCode) ? StatusCodes.INTERNAL_SERVER_ERROR : err.statusCode)
    .send(err.message)
    .end();
};

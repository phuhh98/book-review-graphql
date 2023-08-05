import { StatusCodes } from 'http-status-codes';

export interface GraphqlContext {
  auth: string;
}

export class NextFuncError extends Error {
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  constructor(statusCode: StatusCodes, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

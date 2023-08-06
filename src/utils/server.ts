import { StatusCodes } from 'http-status-codes';
import cluster from 'node:cluster';
import os from 'node:os';
import { NextFuncError } from '../types';

export function runInCluster(callback: () => unknown) {
  const cCPUs = os.cpus().length;
  if (cluster.isPrimary) {
    for (let i = 0; i < cCPUs; i++) {
      cluster.fork();
    }
    cluster.on('online', function (worker) {
      console.info('Worker ' + worker.process.pid + ' is online.');
    });
    cluster.on('exit', function (worker, code, signal) {
      console.info('Worker ' + worker.process.pid + ' died by', code, signal);
    });
  } else {
    callback();
  }
}

export function postStartHandler() {
  const PORT = process.env.SERVER_PORT;

  console.info('Server start at port', PORT);
  console.info(`visit http://localhost:${PORT}`);
}

export const createNextErrorMessage = (
  statusCode: StatusCodes,
  error: Error | string,
) => {
  return new NextFuncError(statusCode, error instanceof Error ? error.message : error);
};

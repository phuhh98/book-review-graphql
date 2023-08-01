import cluster from 'node:cluster';
import os from 'node:os';
import startServer from './app';

const cCPUs = os.cpus().length;

if (cluster.isPrimary) {
  for (let i = 0; i < cCPUs; i++) {
    cluster.fork();
  }
  cluster.on('online', function (worker) {
    console.log('Worker ' + worker.process.pid + ' is online.');
  });
  cluster.on('exit', function (worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died by', code, signal);
  });
} else {
  startServer();
}

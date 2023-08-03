import { createTerminus } from '@godaddy/terminus';
import { Server } from 'node:http';
import util from 'util';

const getKillSignalHandler = (server: Server) =>
  util.promisify(function killSignalHanlder() {
    console.info('Received kill signal, shutting down gracefully');
    return server.close(() => {
      console.info('Closed out remaining connections');
      process.exit(0);
    });
  });

export function applyTerminusGracefullyShutdown(server: Server) {
  createTerminus(server, {
    signals: ['SIGINT', 'SITERM'],
    onSignal: getKillSignalHandler(server),
  });
}

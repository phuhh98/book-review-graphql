import { createTerminus } from '@godaddy/terminus';
import { Server } from 'http';

function getKillSignalHandler(server: Server) {
  return async function killSignalHanlder(): Promise<typeof server> {
    console.info('Received kill signal, shutting down gracefully');
    return server.close(() => {
      console.info('Closed out remaining connections');
      process.exit(0);
    });
  };
}

export function applyTerminusGracefullyShutdown(server: Server) {
  createTerminus(server, {
    signals: ['SIGINT', 'SITERM'],
    onSignal: getKillSignalHandler(server),
  });
}

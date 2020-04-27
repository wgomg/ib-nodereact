'use strict';

const app = require('./app');

const logger = require('./libraries/logger');

const config = require('./config').server;

const PORT = config.port;
const server = app.listen(PORT, () => logger.info(`Server started on port ${PORT}`, 'server'));

setInterval(
  () =>
    server.getConnections((err, connections) =>
      logger.connection(`${connections} connections currently open`)
    ),
  1000
);

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

let connections = [];

server.on('connection', (connection) => {
  connections.push(connection);
  connection.on('close', () => (connections = connections.filter((curr) => curr !== connection)));
});

function shutDown() {
  logger.connection('Received kill signal, shutting down gracefully');

  server.close(() => {
    logger.connection('Closed out remaining connections');
    process.exit(0);
  });

  setTimeout(() => {
    logger.connection('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);

  connections.forEach((curr) => curr.end());
  setTimeout(() => connections.forEach((curr) => curr.destroy()), 5000);
}

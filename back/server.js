'use strict';

require('dotenv').config();

const app = require('./app');
const cache = require('./libraries/cache');

const PORT = process.env.SERVER_PORT;
const server = app.listen(PORT, () =>
  console.info(`Server started on port ${PORT}`, 'server')
);

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

let connections = [];

server.on('connection', (connection) => {
  connections.push(connection);
  connection.on(
    'close',
    () => (connections = connections.filter((curr) => curr !== connection))
  );
});

function shutDown() {
  console.info('Received kill signal, shutting down');

  server.close(() => {
    console.info('Closed out remaining connections');
    process.exit(0);
  });

  cache.close();
  console.info('Flushing cache');

  setTimeout(() => {
    console.info(
      'Could not close connections in time, forcefully shutting down'
    );
    process.exit(1);
  }, 10000);

  connections.forEach((curr) => curr.end());
  setTimeout(() => connections.forEach((curr) => curr.destroy()), 5000);
}

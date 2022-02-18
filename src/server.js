/* eslint-disable max-len */
const app = require('./app');
const config = require('./config/config');

const {serverLogger} = require('./helpers/logger/serverLogger');
const centralErrorHandler = require('./helpers/error/centralErrorHandler');
const serverTerminator = require('./utils/serverTerminator');
const socket = require('./socket');

const PORT = config.app.port;
const SOCKET_PORT = config.app.socket_port;

global.server = app.listen(PORT, () => {
  serverLogger.info(`Server Started And Listening On Port ${PORT}`);
});

global.socket = socket.listen(SOCKET_PORT);

process.on('uncaughtException', (err) => {
  centralErrorHandler(err);
});
process.on('unhandledRejection', (err) => {
  centralErrorHandler(err);
});

process.on('SIGTERM', () => {
  serverLogger.info(`process ${process.pid} received terminate SIGTERM signal!...exiting...`);
  serverTerminator();
});

process.on('SIGINT', () => {
  serverLogger.info(`process ${process.pid} received interrupt SIGTERM signal!...exiting...`);
  serverTerminator();
});

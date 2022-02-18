const BaseError = require('./BaseError');
const serverTerminator = require('../../utils/serverTerminator');
const {serverLogger} = require('../logger/serverLogger');

const isOperational = (err) => {
  if (err instanceof BaseError) {
    return err.isOperational;
  }
  return false;
};

const centralErrorHandler = (err) => {
  const errorMessage = JSON.stringify({
    message: err.message,
    type: err.constructor.name,
  });

  if (isOperational(err)) {
    serverLogger.warn(errorMessage);
  } else {
    serverLogger.error(errorMessage);

    //  Restart Server
    serverTerminator();
  }
};

module.exports = centralErrorHandler;

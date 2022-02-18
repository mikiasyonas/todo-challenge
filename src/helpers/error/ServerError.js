const BaseError = require('./BaseError');
const {INTERNAL_SERVER} = require('../constants/statusCodes');

// eslint-disable-next-line require-jsdoc
module.exports = class ServerError extends BaseError {
  // eslint-disable-next-line require-jsdoc
  constructor(description = 'Internal Server Error') {
    super('Server Error', INTERNAL_SERVER, true, description);
  }
};

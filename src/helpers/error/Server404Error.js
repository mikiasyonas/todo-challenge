/* eslint-disable require-jsdoc */
const {NOT_FOUND} = require('../constants/statusCodes');
const BaseError = require('./BaseError');

module.exports = class Server404Error extends BaseError {
  constructor(description = 'Not Found Error') {
    super('Not Found Error', NOT_FOUND, true, description);
  }
};

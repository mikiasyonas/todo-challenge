/* eslint-disable require-jsdoc */
const {BAD_REQUEST} = require('../constants/statusCodes');
const BaseError = require('./BaseError');

module.exports = class ValidationError extends BaseError {
  constructor(description = 'Validation Error') {
    super('Validation Error', BAD_REQUEST, true, description);
  }
};

/* eslint-disable max-len */
const centralErrorHandler = require('../../../helpers/error/centralErrorHandler');

const errorHandler = (err, req, res, next) => {
  centralErrorHandler(err);

  return next(err);
};

module.exports = {errorHandler};

const Server404Error = require('../../../helpers/error/Server404Error');
const ValidationError = require('../../../helpers/error/ValidationError');
const {errorResponse} = require('../../../utils/responses');

const clientErrorHandler = (err, req, res, next) => {
  switch (err.constructor) {
    case ValidationError:
      return errorResponse(res, err.httpCode, 'Invalid Input Given');
    case Server404Error:
      return errorResponse(res, err.httpCode, 'Not Found Error');
    default:
      return errorResponse(res, err.httpCode, 'Something Went Wrong');
  }
};

module.exports = clientErrorHandler;

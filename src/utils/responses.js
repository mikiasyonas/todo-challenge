const {OK} = require('../helpers/constants/statusCodes');

const errorResponse = (res, httpCode, payload) => {
  res.status(httpCode).json({
    success: false,
    message: payload,
  });
};

const successResponse = (res, payload, message) => {
  res.status(OK).json({
    success: true,
    message: message,
    data: payload,
  });
};


module.exports = {
  errorResponse,
  successResponse,
};

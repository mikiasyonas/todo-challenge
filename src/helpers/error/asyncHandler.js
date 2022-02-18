const ServerError = require('./ServerError');
const ValidationError = require('./ValidationError');

const Joi = require('joi');

const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next)
      .catch((err) => {
        switch (err.constructor) {
          case Joi.ValidationError:
            return next(new ValidationError(err.message));
          default:
            return next(new ServerError(err.message));
        }
      });
};

module.exports = asyncHandler;

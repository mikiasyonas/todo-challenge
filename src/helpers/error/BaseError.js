// eslint-disable-next-line require-jsdoc
class BaseError extends Error {
  // eslint-disable-next-line require-jsdoc
  constructor(name, httpCode, isOperational, description) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}


module.exports = BaseError;

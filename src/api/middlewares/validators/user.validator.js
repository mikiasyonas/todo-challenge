/* eslint-disable max-len */
const asyncHandler = require('../../../helpers/error/asyncHandler');
const UserValidationSchema = require('../../../helpers/dataValidator/user.schema');

const signInValidator = asyncHandler(async (req, res, next) => {
  await UserValidationSchema.signInSchema.validateAsync(req.body, UserValidationSchema.schemaOptions);
  return next();
});

const SignUpValidator = asyncHandler(async (req, res, next) => {
  await UserValidationSchema.signUpSchema.validateAsync(req.body, UserValidationSchema.schemaOptions);
  return next();
});

module.exports = {
  signInValidator,
  SignUpValidator,
};

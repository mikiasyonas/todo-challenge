/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');

const UserLogin = require('../../../database/models/UserLogin');
const BlackListedToken = require('../../../database/models/BlackListedToken');

const asyncHandler = require('../../../helpers/error/asyncHandler');
const {errorResponse} = require('../../../utils/responses');
// eslint-disable-next-line max-len
const {UNAUTHORIZED, FORBIDDEN} = require('../../../helpers/constants/statusCodes');
const config = require('../../../config/config');

const authenticateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  const bearer = authHeader && authHeader.split(' ')[0];

  if (bearer != 'Bearer') {
    return errorResponse(res,
        UNAUTHORIZED,
        'Auth token required');
  }

  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return errorResponse(res, UNAUTHORIZED, 'Auth token required');
  }

  BlackListedToken.find({
    token: token,
  }).then((found) => {
    if (found.length > 0) {
      return errorResponse(res,
          UNAUTHORIZED,
          'Token blacklisted. Cannot use this token');
    } else {
      jwt.verify(token, config.app.secret, async (err, payload) => {
        if (err) {
          return errorResponse(res, FORBIDDEN, 'Unable to verify the token.');
        }

        if (payload) {
          const login = await UserLogin.findOne({
            userId: payload.id,
            tokenId: payload.tokenId,
          });

          if (login.tokenDeleted) {
            const blackListedToken = await BlackListedToken.create({
              token: token,
            });

            // eslint-disable-next-line max-len
            return errorResponse(res, FORBIDDEN, 'Token deleted. Cannot use this token');
          }
        }

        req.user = payload;

        return next();
      });
    }
  });
});

module.exports = {
  authenticateToken,
};

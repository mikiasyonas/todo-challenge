const jwt = require('jsonwebtoken');
const customId = require('custom-id');
const UserLogin = require('../database/models/UserLogin');
const config = require('../config/config');
const userLoginService = require('../services/userLogins.service');

const createToken = async (user, req) => {
  const tokenId = await customId({
    userId: user._id,
    date: Date.now(),
    randomLength: 4,
  });

  const ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
         req.connection.remoteAddress ||
         req.socket.remoteAddress ||
         req.connection.socket.remoteAddress;

  // eslint-disable-next-line max-len
  const userLogins = await UserLogin.find({
    userId: user._id,
    tokenDeleted: false,
    ipAddress: ip,
    device: req.headers['user-agent'],
  });

  userLogins.forEach(async (login) => {
    if (login) {
      login.tokenDeleted = true;
      await login.save();
    }
  });

  const tokenSecret = await customId({
    tokenSecret: ip,
    date: Date.now(),
    randomLength: 8,
  });

  const userInfo = {
    userId: user._id,
    tokenId: tokenId,
    tokenSecret: tokenSecret,
    ipAddress: ip,
    device: req.headers['user-agent'],
  };

  const userLogin = await userLoginService.createUserLogin(userInfo);

  const tokenUser = {
    id: userLogin.userId,
    tokenId: tokenId,
  };

  const accessToken = jwt.sign(tokenUser, config.app.secret);

  return accessToken;
};

module.exports = {
  createToken,
};

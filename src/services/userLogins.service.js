const BlackListedToken = require('../database/models/BlackListedToken');
const User = require('../database/models/User');
const UserLogin = require('../database/models/UserLogin');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const {
  FORBIDDEN,
  UNAUTHORIZED,
  OK,
  BAD_REQUEST,
} = require('../helpers/constants/statusCodes');

const showUserLogins = async (userId, tokenId) => {
  const userDetail = await User.findOne({
    _id: userId,
  });

  if (userDetail) {
    const userLogins = await UserLogin.find({
      userId: userDetail._id,
      tokenDeleted: false,
    });

    let current = false;

    const logins = [];

    userLogins.forEach(async (login) => {
      current = false;
      if (tokenId == login.tokenId) {
        current = true;
      }

      login.current = current;
      logins.push(login);
    });

    return logins;
  } else {
    return null;
  }
};

const createUserLogin = async (userInfo) => {
  const userLogin = new UserLogin({
    userId: userInfo.userId,
    tokenId: userInfo.tokenId,
    tokenSecret: userInfo.tokenSecret,
    ipAddress: userInfo.ipAddress,
    device: userInfo.device,
  });

  const savedUserLogin = await userLogin.save();

  return savedUserLogin;
};

const deleteUserLogin = async (loginId, userDetail) => {
  const user = User.findOne({
    _id: userDetail.id,
  });

  if (user) {
    const userLogin = await UserLogin.findOne({
      _id: loginId,
    });

    if (userLogin.userId != userDetail.id) {
      return {
        success: false,
        code: UNAUTHORIZED,
      };
    } else {
      userLogin.tokenDeleted = true;

      await userLogin.save();

      return {
        success: true,
        code: OK,
      };
    }
  }

  return {
    success: false,
    code: BAD_REQUEST,
  };
};

const deleteAllUserLoginsExceptCurrent = async (userDetail) => {
  const user = await User.find({
    _id: userDetail.id,
  });

  if (user) {
    const userLogins = await UserLogin.find({
      userId: userDetail.id,
    });

    let current = false;

    userLogins.forEach(async (login) => {
      current = false;

      if (userDetail.tokenId == login.tokenId) {
        current = true;
      }

      if (current != true) {
        login.tokenDeleted = true;
        login.loggedOut = true;
        login.save();
      }
    });

    return {
      success: true,
      code: OK,
    };
  }

  return {
    success: false,
    code: BAD_REQUEST,
  };
};

const deleteAllUserLogins = async (userDetail) => {
  const user = await User.find({
    _id: userDetail.id,
  });

  const userLogins = await UserLogin.find({
    userId: user.id,
  });

  if (userLogins) {
    userLogins.forEach(async (login) => {
      login.tokenDeleted = true;
      login.loggedOut = true;
      await login.save();
    });

    return {
      success: true,
      code: OK,
    };
  }

  return {
    success: false,
    code: BAD_REQUEST,
  };
};

const blackListAToken = async (token) => {
  BlackListedToken.findOne({
    token: token,
  }).then((found) => {
    if (found) {
      jwt.verify(token, config.app.secret, async (err, payload) => {
        const login = await UserLogin.findOne({
          userId: payload.id,
          tokenId: payload.tokenId,
        });

        login.loggedOut = true;
        login.tokenDeleted = true;
        await login.save();
      });

      return {
        success: false,
        code: UNAUTHORIZED,
      };
    } else {
      jwt.verify(token, config.app.secret, async (err, payload) => {
        if (err) {
          return {
            success: false,
            code: FORBIDDEN,
          };
        }

        if (payload) {
          const login = await UserLogin.findOne({
            userId: payload.id,
            tokenId: payload.tokenId,
          });

          if (token.tokenDeleted) {
            login.loggedOut = true;
            await login.save();

            await BlackListedToken.create({
              token: token,
            });
          } else {
            login.loggedOut = true;
            login.tokenDeleted = true;
            await login.save();

            await BlackListedToken.create({
              token: token,
            });
          }
        }

        return {
          success: true,
          code: OK,
        };
      });
    }
  });
};

module.exports = {
  showUserLogins,
  createUserLogin,
  blackListAToken,
  deleteUserLogin,
  deleteAllUserLogins,
  deleteAllUserLoginsExceptCurrent,
};

const _ = require('lodash');
const {emailEvent} = require('../../subscribers/send_email_confirmation');

const config = require('../../config/config');
const UserService = require('../../services/user.service');
const UserLoginsService = require('../../services/userLogins.service');

const {createToken} = require('../../utils/token');

const {successResponse, errorResponse} = require('../../utils/responses');
// eslint-disable-next-line max-len
const {
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
} = require('../../helpers/constants/statusCodes');
const asyncHandler = require('../../helpers/error/asyncHandler');
const {serverLogger} = require('../../helpers/logger/serverLogger');

const {compareHash, hashText} = require('../../utils/hashGenerators');

const userSignUp = asyncHandler(async (req, res) => {
  const userData = req.body;
  const user = await UserService.signUp(userData);

  if (!user.success) {
    return errorResponse(res, user.code, user.msg);
  } else {
    savedUser = user.savedUser;
    const token = await createToken(savedUser, req);

    savedUser.accessToken = token;

    res.cookie('token', token, {
      httpOnly: true,
      secure: config.app.secureCookie,
      sameSite: true,
    });

    serverLogger.info(`User With Id ${savedUser._id} Successfully Registered`);
    emailEvent.emit('user_regsistered', savedUser);

    return successResponse(
        res,
        _.pick(savedUser,
            [
              '_id',
              'firstName',
              'lastName',
              'userName',
              'email',
              'phoneNumber',
              'accessToken',
            ],
        ), 'User Saved To Database');
  }
});

const userSignIn = asyncHandler(async (req, res) => {
  const userData = req.body;
  const user = await UserService.signIn(userData);

  if (!user.success) {
    return errorResponse(res, user.code, user.msg);
  }
  const token = await createToken(user, req);

  user.accessToken = token;

  res.cookie('token', token, {
    httpOnly: true,
    secure: config.app.secureCookie,
    sameSite: true,
  });
  serverLogger.info(`User With Id ${user._id} Successfully Logged In`);

  return successResponse(
      res,
      _.pick(user,
          [
            '_id',
            'firstName',
            'lastName',
            'email',
            'accessToken',
          ],
      ), 'Successful Login');
});

const userSignOut = asyncHandler(async (req, res) => {
  const authHeader = req.headers['authorization'];

  const bearer = authHeader && authHeader.split(' ')[0];

  if (bearer != 'Bearer') {
    return errorResponse(res,
        UNAUTHORIZED,
        'Auth token required');
  }

  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return errorResponse(
        res,
        UNAUTHORIZED,
        'Auth token required',
    );
  }

  const blackListed = await UserLoginsService.blackListAToken(token);

  if (blackListed.success) {
    return successResponse(res, { }, 'Successfully Signed Out');
  } else {
    switch (blackListed.code) {
      case UNAUTHORIZED:
        return errorResponse(res,
            UNAUTHORIZED,
            'Token blacklisted. Cannot use this token');
      case FORBIDDEN:
        return errorResponse(res,
            FORBIDDEN,
            'Unable to verify token');
    }
  }
});

const showUserLogins = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const tokenId = req.user.tokenId;

  const userLogins = await UserLoginsService.showUserLogins(userId, tokenId);

  if (!userLogins) {
    return errorResponse(res,
        BAD_REQUEST,
        'Something went wrong try again!');
  } else {
    return successResponse(res, userLogins);
  }
});

const deleteUserLogin = asyncHandler(async (req, res) => {
  const loginId = req.params.login_id;
  const userDetail = req.user;
  const deletedLogin = await UserLoginsService.deleteUserLogin(loginId,
      userDetail);

  if (deletedLogin.success) {
    return successResponse(res, { }, 'Successfully deleted a login');
  } else {
    switch (deletedLogin.code) {
      case UNAUTHORIZED:
        return errorResponse(res,
            UNAUTHORIZED,
            'You can only delete your login');
      case BAD_REQUEST:
        return errorResponse(res,
            BAD_REQUEST,
            'Something went wrong!');
    }
  }
});

const deleteAllUserLogins = asyncHandler(async (req, res) => {
  const userDetail = req.user;
  const deletedLogin = await UserLoginsService.deleteAllUserLogins(userDetail);

  if (deletedLogin.success) {
    return successResponse(res,
        { }, 'Successfully deleted all logins!');
  } else {
    switch (deletedLogin.code) {
      case BAD_REQUEST:
        return errorResponse(res,
            BAD_REQUEST,
            'Something went wrong!');
    }
  }
});

const deleteAllUserLoginsExceptCurrent = asyncHandler(async (req, res) => {
  const userDetail = req.user;

  // eslint-disable-next-line max-len
  const deletedLogin = await UserLoginsService.deleteAllUserLoginsExceptCurrent(userDetail);

  if (deletedLogin.success) {
    return successResponse(res,
        { }, 'Successfully deleted all logins but this one!');
  } else {
    switch (deletedLogin.code) {
      case BAD_REQUEST:
        return errorResponse(res,
            BAD_REQUEST,
            'Something went wrong!');
    }
  }
});

const checkEmail = asyncHandler(async (req, res) => {
  const {email} = req.params;

  const emailExists = UserService.checkEmailAvailability(email);

  if (emailExists) {
    return successResponse(res,
        {
          exists: true,
        }, 'Email exists');
  } else {
    return successResponse(res,
        {
          exists: false,
        }, 'Email does not exist');
  }
});

const checkUserName = asyncHandler(async (req, res) => {
  const {userName} = req.params;

  const userNameExists = UserService.checkEmailAvailability(userName);

  if (userNameExists) {
    return successResponse(res,
        {
          exists: true,
        }, 'userName exists');
  } else {
    return successResponse(res,
        {
          exists: false,
        }, 'userName does not exist');
  }
});

const verifyAccount = asyncHandler(async (req, res) => {
  const {confirmationCode} = req.body;
  const user = req.user;

  const requestedUser = await UserService.findById(user.id);

  if (!(requestedUser.found)) {
    return errorResponse(res,
        BAD_REQUEST,
        requestedUser.message);
  }
  if (requestedUser.data.confirmationCode == confirmationCode) {
    requestedUser.data.activated = true;
    requestedUser.data.confirmationCode = '';

    await requestedUser.data.save();
    return successResponse(res,
        { },
        'Account activated!');
  } else {
    errorResponse(res,
        BAD_REQUEST,
        'Confirmation code not correct!');
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const user = req.user;

  const {data} = await UserService.findById(user.id);

  const {newPassword, oldPassword} = req.body;

  if (compareHash(oldPassword, data.password)) {
    data.password = await hashText(newPassword);
    await data.save();

    return successResponse(res, { }, 'Successfully changed password');
  } else {
    return errorResponse(res,
        BAD_REQUEST,
        'Passwords do not match');
  }
});


module.exports = {
  userSignUp,
  userSignIn,
  userSignOut,
  showUserLogins,
  deleteUserLogin,
  deleteAllUserLogins,
  deleteAllUserLoginsExceptCurrent,
  checkEmail,
  checkUserName,
  verifyAccount,
  changePassword,
};

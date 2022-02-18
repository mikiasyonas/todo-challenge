const JWT = require('jsonwebtoken');

const User = require('../database/models/User');
const {hashText, compareHash} = require('../utils/hashGenerators');
const {BAD_REQUEST} = require('../helpers/constants/statusCodes');

const config = require('../config/config');


const findById = async (id) => {
  const userFound = await User.findById(id);

  if (userFound) {
    return {
      found: true,
      data: userFound,
    };
  } else {
    return {
      found: false,
      message: 'No user found with this Id',
    };
  }
};

const signUp = async ({
  firstName,
  lastName,
  userName,
  email,
  phoneNumber,
  password,
}) => {
  const userNameTaken = await User.findOne({
    userName: userName,
  }).lean();

  const emailTaken = await User.findOne({
    email: email,
  }).lean();

  if (userNameTaken) {
    return {
      success: false,
      msg: 'Username already taken!',
      code: BAD_REQUEST,
    };
  }

  if (emailTaken) {
    return {
      success: false,
      msg: 'Email already taken!',
      code: BAD_REQUEST,
    };
  }

  // eslint-disable-next-line max-len
  const confirmationCode = (Math.floor(10000 + Math.random() * 900000)).toString();

  const hashedPassword = await hashText(password);
  const newUser = new User({
    firstName,
    lastName,
    userName,
    email,
    phoneNumber,
    password: hashedPassword,
    role: 'user',
    confirmationCode: confirmationCode,
  });

  const savedUser = await newUser.save();

  return {
    success: true,
    savedUser: savedUser,
  };
};

const signIn = async ({
  userName,
  password,
}) => {
  const user = await User.findOne({
    userName,
  }).lean();

  if (!user) {
    return {
      success: false,
      msg: 'Username Incorrect!',
      code: BAD_REQUEST,
    };
  }

  const passwordRight = await compareHash(password, user.password);

  if (!passwordRight) {
    return {
      success: false,
      msg: 'Password Incorrect!',
      code: BAD_REQUEST,
    };
  }

  user.success = true;

  return user;
};

const generateToken = (userId, userName) => {
  const payload = {
    id: userId,
    username: userName,
  };

  return JWT.sign(payload, config.app.secret, {
    expiresIn: '48h',
  });
};

const checkUserNameAvailability = async (userName) => {
  const user = await User.findOne({
    userName: userName,
  });

  if (!user) {
    return false;
  } else {
    return true;
  }
};

const checkEmailAvailability = async (email) => {
  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    return false;
  } else {
    return true;
  }
};

module.exports = {
  findById,
  signUp,
  signIn,
  generateToken,
  checkUserNameAvailability,
  checkEmailAvailability,
};

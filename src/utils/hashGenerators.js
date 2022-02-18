const bcrypt = require('bcrypt');

const ServerError = require('../helpers/error/ServerError');

const hashText = async (text, round = 10) => {
  try {
    const salt = await bcrypt.genSalt(round);

    return await bcrypt.hash(text, salt);
  } catch (e) {
    throw new ServerError(e.message);
  }
};

const compareHash = async (text, hash) => {
  try {
    return await bcrypt.compare(text, hash);
  } catch (e) {
    throw new ServerError(e.message);
  }
};

module.exports = {
  hashText,
  compareHash,
};

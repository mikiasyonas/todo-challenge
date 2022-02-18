const axios = require('axios');
const urlEncodedOptions = require('../utils/urlEncodedRequest');
const config = require('../config/config');

const sendMessage = async (userId, text) => {
  const data = {
    chat_id: userId,
    text: text,
  };
  // eslint-disable-next-line max-len
  const telegramURL = `${ config.app.telegram_url }/bot${ config.app.telegram_bot_token }/sendMessage`;
  // eslint-disable-next-line max-len
  const options = await urlEncodedOptions.urlEncodedRequest(data, 'GET', telegramURL);

  const result = await axios(options);

  return result;
};

module.exports = {
  sendMessage,
};

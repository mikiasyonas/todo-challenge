const asyncHandler = require('../../helpers/error/asyncHandler');
const axios = require('axios');
const config = require('../../config/config');
const telegramBotService = require('../../services/telegramBot.service');
const {successResponse, errorResponse} = require('../../utils/responses');
const _ = require('lodash');

const botMainController = asyncHandler(async (req, res) => {
  console.log(req.body);

  return successResponse(res,
      {}, '');
});

const sendMessage = asyncHandler(async (req, res) => {
  const {userId} = req.params;
  const {text} = req.body;

  const result = await telegramBotService.sendMessage(userId, text);

  if (result.data.ok) {
    return successResponse(res,
        _.pick(result.data.result, [
          'date',
          'text',
        ]),
        'Successfully sent message');
  } else {
    return errorResponse(res,
        400,
        result.data.description);
  }
});

const setWebhook = asyncHandler(async (req, res) => {
  // eslint-disable-next-line max-len
  const url = `${ config.app.telegram_url }/bot${ config.app.telegram_bot_token }/setWebhook?url=${ config.app.telegram_webhook_url }`;

  const result = await axios.get(url);

  return successResponse(res,
      result.data,
      'Successfully set up webhook');
});

const webhookInfo = asyncHandler(async (req, res) => {
  // eslint-disable-next-line max-len
  const url = `${ config.app.telegram_url }/bot${ config.app.telegram_bot_token }/getWebhookInfo`;

  const result = await axios.get(url);

  return successResponse(res,
      result.data,
      'Webhook info');
});

const getUpdates = asyncHandler(async (req, res) => {
  // eslint-disable-next-line max-len
  const url = `${ config.app.telegram_url }/bot${ config.app.telegram_bot_token }/getUpdates`;

  const result = await axios.get(url);

  return successResponse(res,
      result.data,
      'updates');
});

const deleteWebhook = asyncHandler(async (req, res) => {
  // eslint-disable-next-line max-len
  const url = `${ config.app.telegram_url }/bot${ config.app.telegram_bot_token }/deleteWebhook`;

  const result = await axios.get(url);

  return successResponse(res,
      result.data,
      'deleted webhook');
});

module.exports = {
  botMainController,
  setWebhook,
  sendMessage,
  webhookInfo,
  getUpdates,
  deleteWebhook,
};

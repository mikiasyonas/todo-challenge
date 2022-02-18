const express = require('express');
// eslint-disable-next-line new-cap
const telegramBotRouter = express.Router();

const botMainController = require('../../controllers/telegram_bot.controller');

telegramBotRouter.post('/', botMainController.botMainController);
telegramBotRouter.get('/', botMainController.botMainController);
telegramBotRouter.get('/set-webhook', botMainController.setWebhook);
telegramBotRouter.post('/send-message/:userId', botMainController.sendMessage);
telegramBotRouter.get('/get-webhook-info', botMainController.webhookInfo);
telegramBotRouter.get('/get-updates', botMainController.getUpdates);
telegramBotRouter.delete('/delete-webhook', botMainController.deleteWebhook);

module.exports = telegramBotRouter;

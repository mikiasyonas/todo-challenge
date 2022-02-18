const express = require('express');

// eslint-disable-next-line new-cap
const botRouter = express.Router();

const telegramRouter = require('./telegram_bot.routes');

botRouter.use('/telegram', telegramRouter);

module.exports = botRouter;


const express = require('express');
// eslint-disable-next-line new-cap
const indexRouter = express.Router();

const authRouter = require('./auth.routes');
const botRouter = require('./bot');

indexRouter.use('/auth', authRouter);
indexRouter.use('/bot', botRouter);

module.exports = indexRouter;

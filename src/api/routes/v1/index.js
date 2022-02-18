const express = require('express');
// eslint-disable-next-line new-cap
const indexRouter = express.Router();

const authRouter = require('./auth.routes');
const todoRouter = require('./todo.routes');

indexRouter.use('/auth', authRouter);
indexRouter.use('/todo', todoRouter);

module.exports = indexRouter;

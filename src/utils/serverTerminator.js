const mongoose = require('mongoose');

const {serverLogger} = require('../helpers/logger/serverLogger');

const serverTerminator = () => {
  global.server.close((err) => {
    if (err) {
      serverLogger.error(err.message);
      process.exit(1);
    }

    mongoose.connection.close(() => {
      process.exit(0);
    });
  });
};

module.exports = serverTerminator;

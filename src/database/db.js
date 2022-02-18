/* eslint-disable max-len */
const mongoose = require('mongoose');

const config = require('../config/config');
const {serverLogger} = require('../helpers/logger/serverLogger');

const dbURI = `mongodb://${ config.db.host }:${ config.db.port }/${ config.db.name }`;

const connectToDatabase = () => {
  mongoose.connect(dbURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  // Connection events
  mongoose.connection.on('connecting', () => {
    serverLogger.info('Connecting to the database...');
  });

  mongoose.connection.on('connected', () => {
    serverLogger.info('Connected to the database');
  });

  mongoose.connection.on('error', (error) => {
    serverLogger.info(`Error while connecting to the database \n Reason: ${ error }`);
  });

  mongoose.connection.on('disconnected', () => {
    serverLogger.info('Disconnected from the database');
  });

  //  If the app terminates close Mongoose connection
  process.on('SIGINT', () => {
    // eslint-disable-next-line max-len
    serverLogger.info('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
};


module.exports = connectToDatabase;

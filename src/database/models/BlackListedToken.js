/* eslint-disable new-cap */
const mongoose = require('mongoose');

const blackListedTokenSchema = mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// eslint-disable-next-line max-len
const BlackListedToken = mongoose.model('black_listed_tokens', blackListedTokenSchema);

module.exports = BlackListedToken;

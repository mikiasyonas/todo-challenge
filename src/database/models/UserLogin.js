const mongoose = require('mongoose');

// eslint-disable-next-line new-cap
const userLoginSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  loggedOut: {
    type: Boolean,
    required: false,
  },
  loggedOutAt: {
    type: Date,
    default: Date.now(),
  },
  loggedInAt: {
    type: Date,
    default: Date.now(),
  },
  ipAddress: {
    type: String,
  },
  tokenId: {
    type: String,
    unique: true,
    required: true,
  },
  tokenSecret: {
    type: String,
  },
  tokenDeleted: {
    type: Boolean,
    default: false,
  },
  device: {
    type: String,
  },
}, {
  timestamps: true,
});

const UserLogin = mongoose.model('user_login', userLoginSchema);

module.exports = UserLogin;

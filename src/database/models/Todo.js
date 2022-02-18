/* eslint-disable new-cap */
const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
  task: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Todo = mongoose.model('todo', todoSchema);

module.exports = Todo;

const _ = require('lodash');

const {successResponse, errorResponse} = require('../../utils/responses');

const Todo = require('../../database/models/Todo');

const {
  BAD_REQUEST, INTERNAL_SERVER,
} = require('../../helpers/constants/statusCodes');

const asyncHandler = require('../../helpers/error/asyncHandler');

const {serverLogger} = require('../../helpers/logger/serverLogger');

const createTodo = asyncHandler(async (req, res) => {
  const todoData = req.body;

  const newTodo = new Todo({
    task: todoData.task,
  });

  const savedTodo = await newTodo.save();

  serverLogger.info(`Created a new todo with id ${savedTodo._id} successfully`);

  return successResponse(
      res,
      _.pick(savedTodo, [
        '_id',
        'task',
        'completed',
      ]),
      'Todo saved to database',
  );
});

const getAllTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find();

  return successResponse(res, todos, 'Todos');
});

const getNotCompletedTodos = asyncHandler(async (req, res) => {
  const notCompletedTodos = await Todo.find().where('completed').equals(false);

  return successResponse(res, notCompletedTodos, 'Not completed todos');
});

const getCompletedTodos = asyncHandler(async (req, res) => {
  const completedTodos = await Todo.find().where('completed').equals(true);

  return successResponse(res, completedTodos, 'Completed todos');
});

const getTodoById = asyncHandler(async (req, res) => {
  const {id} = req.params;
  const todo = await Todo.findById(id);

  return successResponse(
      res,
      _.pick(todo, [
        '_id',
        'task',
        'completed',
      ]), 'Todo lists',
  );
});

const editTodo = asyncHandler(async (req, res) => {
  const {id} = req.params;
  const {task} = req.body;

  const todo = await Todo.findOne({
    _id: id,
  });


  if (!todo) {
    return errorResponse(res, BAD_REQUEST, 'No todo with this id');
  }

  todo.task = task;

  const updatedTodo = await todo.save();

  if (!updatedTodo) {
    return errorResponse(res, INTERNAL_SERVER, 'Somwthing went wrong');
  }

  return successResponse(
      res,
      _.pick(updatedTodo, [
        '_id',
        'task',
        'completed',
      ]), 'Todo lists',
  );
});

const markTodoComplete = asyncHandler(async (req, res) => {
  const {id} = req.params;

  const todo = await Todo.findOne({
    _id: id,
  });


  if (!todo) {
    return errorResponse(res, BAD_REQUEST, 'No todo with this id');
  }

  todo.completed = true;

  const updatedTodo = await todo.save();

  if (!updatedTodo) {
    return errorResponse(res, INTERNAL_SERVER, 'Somwthing went wrong');
  }

  return successResponse(
      res,
      _.pick(updatedTodo, [
        '_id',
        'task',
        'completed',
      ]), 'Todo lists',
  );
});

const deleteTodo = asyncHandler(async (req, res) => {
  const {id} = req.params;

  await Todo.deleteOne({
    _id: id,
  });

  return successResponse(res, {}, 'Successfully deleted a todo');
});

module.exports = {
  createTodo,
  getAllTodos,
  getNotCompletedTodos,
  getCompletedTodos,
  getTodoById,
  editTodo,
  markTodoComplete,
  deleteTodo,
};



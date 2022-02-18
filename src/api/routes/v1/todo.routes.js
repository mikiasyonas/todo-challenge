/* eslint-disable new-cap */
const express = require('express');

const TodoController = require('../../controllers/todo.controller');

const todoRouter = express.Router();


todoRouter.post('/', TodoController.createTodo);
todoRouter.get('/', TodoController.getAllTodos);
todoRouter.get('/not-completed', TodoController.getNotCompletedTodos);
todoRouter.get('/completed', TodoController.getCompletedTodos);
todoRouter.get('/:id', TodoController.getTodoById);
todoRouter.put('/:id', TodoController.editTodo);
todoRouter.put('/complete-todo/:id', TodoController.markTodoComplete);
todoRouter.delete('/:id', TodoController.deleteTodo);

module.exports = todoRouter;

const app = require('./app');
const mongoose = require('mongoose');
const superTest = require('supertest');

const Todo = require('./database/models/Todo');

beforeEach((done) => {
  mongoose.connect('mongodb://localhost:27017/todo-challenge',
      {useNewUrlParser: true, useUnifiedTopology: true},
      () => done());
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});


test('GET /api/v1/todo', async () => {
  const todo = await Todo.create({
    task: 'Simple test task',
  });

  await superTest(app).get('/api/v1/todo')
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body.data)).toBeTruthy();
        expect((response.body.data.length)).toEqual(1);

        expect(String(response.body.data[0]._id)).toEqual(String(todo._id));
        expect(response.body.data[0].task).toBe(todo.task);
      });
});


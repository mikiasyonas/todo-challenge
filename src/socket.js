const options = {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
};
const io = require('socket.io')(options);

io.on('connection', (socket) => {
  socket.emit('welcome', {
    message: 'welcome to chatRand',
    socketId: socket.id,
  });

  socket.on('disconnect', (reason) => {

  });
});


module.exports = io;

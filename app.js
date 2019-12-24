require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const socketio = require('socket.io');

const { socketServer, socketClient } = require('./src/messaging');
const { poller } = require('./src/db-poller');
const { User } = require('./src/model/user');

const indexRouter = require('./routes/index');
const dataRouter = require('./routes/data');

// http handler
const app = express();
// http server
const server = http.createServer(app);
// socketio server
const io = socketio(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/data', dataRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// ZeroMQ messaging
socketServer.listen();
socketClient.listen();

// db poller
poller.onChange((curr, diff) => {
  console.log('tableupdate');
  io.emit('tableupdate', diff, { for: 'everyone' });
});

module.exports = { app, server };

const http = require('http');
const cors = require('cors');
const express = require('express');
const path = require('path');
const fs = require('fs');
const socket = require('socket.io');
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express();
const port = 5000;
const server = http.createServer(app);
const io = require('socket.io')(server, {serveClient: false});
const pino = require('express-pino-logger')();
const client = require('twilio')(accountSid, authToken);

const auth = require('./auth');

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(pino);

app.post('/api/messages', (req, res) => {
  res.header('Content-Type', 'application/json');
  client.messages
    .create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: req.body.to,
      body: req.body.body
    })
    .then(() => {
      res.send(JSON.stringify({ success: true }));
      console.log('Message is sent!');
    })
    .catch(err => {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
    });
});

app.use('/auth', auth);

//Error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err: {}
  })
})

const users = {}

io.sockets.on("error", e => console.log(e));
io.sockets.on("connection", socket => {
  console.log("Socket id: ", socket.id);
  
  socket.emit("yourID", socket.id);
  socket.on("getName", (data) => {
    if(!users[socket.id]) {
      users[socket.id] = data;
      console.log('NODE USERS: ', users);
    }
  })
  io.sockets.emit("allUsers", users);

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.sockets.emit("allUsers", users);
  })

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit('hey', { signal: data.signalData, from: data.from, name: data.name });
  })

  socket.on("acceptCall", (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  })
})


server.listen(process.env.PORT || port);
console.log('Listening on https://34.67.57.171:',port);

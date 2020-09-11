const http = require('http');
const cors = require('cors');
const express = require('express');
const path = require('path');
const fs = require('fs');
const socket = require('socket.io');
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const client = require('twilio')(accountSid, authToken);

const app = express();
const port = 5000;
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(cors());

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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
      console.log('Message is snet!');
    })
    .catch(err => {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
    });
});

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
	console.log("Radi!");
});

app.get('/client', function(req, res) {
  res.writeHead(200);
  res.end("Working!");
  console.log("Radi!");
})

io.sockets.on("error", e => console.log(e));
io.sockets.on("connection", socket => {
  console.log("Socket id: ", socket.id);
  if(!users[socket.id]) {
    users[socket.id] = socket.id;
    console.log("Users from node: ", users);
  }
  
  socket.emit("yourID", socket.id);
  io.sockets.emit("allUsers", users);

  socket.on('disconnect', () => {
    delete users[socket.id];
  })

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit('hey', { signal: data.signalData, from: data.from});
    console.log("Calluser radi");
  })

  socket.on("acceptCall", (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
    console.log("Accept call radi");
  })
})


server.listen(process.env.PORT || port);
console.log('Listening on https://34.67.57.171:',port);

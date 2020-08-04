const http = require('http');
const cors = require('cors');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;
const server = http.createServer(app);
const io = require('socket.io')();

app.use(cors());

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
	console.log("Radi!");
});

app.get('/client', function(req, res) {
  //res.sendFile(path.join(__dirname, 'build', 'index.html'));
  res.writeHead(200);
  res.end("Hello world!");
  console.log("Radi!");
});

let broadcaster;

io.sockets.on("error", e => console.log(e));
io.sockets.on("connection", socket => {
  socket.on("broadcaster", () => {
    broadcaster = socket.id;
    socket.broadcaster.emit("broadcaster");                                     //Sending video stream
  });
  socket.on("watcher", () => {
    socket.to(broadcaster).emit("watcher", socket.id);                          //Watching video stream and sending canvas
  });
  socket.on("disconnect", () => {
    socket.to(broadcaster).emit("disconnectPeer", socket.id);
  });

  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
  });

  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
  });

  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
  });
});


server.listen(process.env.PORT || port);
console.log('Listening on https://34.67.57.171:',port);

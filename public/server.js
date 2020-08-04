var net = require('net');
var http = require('http');
var port = 5000;                   // Datalogger port
var host = '192.168.0.119';         // Datalogger IP address
var fs = require('fs');
var mysql = require('mysql');

//var con = mysql.createConnection({
	//host: "localhost",
	//user: "root",
	//password: "edmir",
	//database: "data"
//});

var tmp = '';

index = fs.readFileSync(__dirname + '/index.html');

http.createServer(onRequest).listen(8080);
net.createServer(createSocket).listen(5000);

function onRequest(req, res, data) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end(index);
}

function createSocket(socket) {
	console.log("Server started: waiting for client connection ...");
	console.log("Client connected: " + socket.remotePort, socket.remoteAddress);
	socket.emit('welcome', { msg: "Welcome!" });
	socket.on('data', function(data) {
		tmp = data.toString();
		//var query = con.query('INSERT INTO MCUdata(MCUData) VALUES(?)', tmp, function(err, result) {
			//if (err) throw err;
			//console.log("1 record inserted");	
		//});
		console.log(data.toString());
		socket.emit('livedata', { livedata: data.toString() });
	});
}

var port = 5000;

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

console.log('** Starting PiLabServer node on port ' + port + '...');

app.use(express.static(__dirname + '/app'));
// app.use('/bower_components', express.static(__dirname +
// '/bower_components'));

// app.get('/', function(req, res) {
// res.writeHead(200, {
// 'Content-Type' : 'text/plain'
// });
// console.log("GET request...");
// res.end('This is socket.io endpoint on port ' + port + ' \n');
// });

io.on('connection', function(socket) {
	var address = socket.handshake.address;
	console.log("*** Conecting ... #" + socket.id + " " + socket.request.connection.remoteAddress);

	socket.on('command', function(msg) {
		//console.log("on command... " + msg.turn);
		
		//var msg = JSON.parse(msg);
		msg.ip = socket.request.connection.remoteAddress;
		
		socket.broadcast.emit('move', msg);
	});

});

http.listen(port, function() {
	console.log('** PiLabServer listening on:' + port + ' ...');
});

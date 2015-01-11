var port = 5000;

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

console.log('** Starting PiLabServer node on port ' + port + '...');

app.get('/', function(req, res) {
	res.writeHead(200, {
		'Content-Type' : 'text/plain'
	});
	console.log("GET request...");
	res.end('This is socket.io endpoint on port ' + port + ' \n');
});

app.use(express.static(__dirname + '/app'));

io.on('connection', function(socket) {
	var address = socket.handshake.address;
	console.log("*** Conecting ... #" + socket.id + " " + socket.request.connection.remoteAddress);

	socket.on('put_position', function(msg) {

	});

});

http.listen(port, function() {
	console.log('** PiLabServer listening on:' + port + ' ...');
});

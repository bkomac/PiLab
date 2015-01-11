var port = 5000;

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var sessions = [];
var numOnlineUsers;

console.log('** Starting PiLabServer node on port ' + port + '...');


app.use(express.static(__dirname + '/webUI'));

io.on('connection', function(socket) {
	var address = socket.handshake.address;
	console.log("*** Conecting ... #" + socket.id + " " + socket.request.connection.remoteAddress);

	socket.on('put_position', function(msg) {
		// console.log(JSON.stringify(socket));
		var pos = JSON.parse(msg);

		pos.socketId = socket.id;

		var user = new User();
		user.setUser(msg.uddi, msg.socketId, pos.user);
//		sessions[pos.user] = user;

		console.log("user: " + pos.user + ":. #" + socket.id + "  " + pos.lat + " " + pos.lng);
		socket.broadcast.emit('get_position', JSON.stringify(pos));
	});
	

});

http.listen(port, function() {
	console.log('** PiLabServer listening on:' + port + ' ...');
});



function User() {
	this.id;
	this.socketId;
	this.userName;
	this.tst;

	this.setUser = function(id, socketId, userName) {
		console.log("getting possition from... " + userName);
		this.id = id;
		this.socketId = socketId;
		this.userName = userName;
		this.tst = new Date().getTime();

		numOnlineUsers++;
	};

}

var port = 5000;

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('url');

var piblaster = require('pi-blaster.js');

var leftMotorFwdGpio = 4;
var leftMotorRwdGpio = 17;
var rightMotorFwdGpio = 18;
var rightMotorRwsGpio = 21;

console.log('*** Starting PiLabServer node on port ' + port + '...');

// app.get('/*', function(req, res) {
// res.writeHead(200, {
// 'Content-Type' : 'text/plain'
// });
//
// var drive = url.parse(req.url).pathname.slice(1);
// console.log("GET request...turn:" + drive);
// if (drive != 0) {
// moveCar({
// "turn" : drive
// });
// } else
// moveCar({
// "turn" : 0
// });
// res.end('Turn= ' + drive + ' \n');
// });

app.use(express.static(__dirname + '/app'));
// app.use('/bower_components', express.static(__dirname +
// '/bower_components'));

io.on('connection', function(socket) {
	var address = socket.handshake.address;
	console.log("*** Conecting ... #" + socket.id + " " + socket.request.connection.remoteAddress);

	socket.on('command', function(msg) {
		// console.log("on command... " + msg.turn);

		// var msg = JSON.parse(msg);
		msg.ip = socket.request.connection.remoteAddress;
		moveCar(msg);
		socket.broadcast.emit('move', msg);
	});

});

http.listen(port, function() {
	console.log('** PiLabServer listening on:' + port + ' ...');
});

function moveCar(msg) {

	msg.speed = msg.speed * 10;

	// turn right
	if (msg.turn < -20) {
		piblaster.setPwm(rightMotorFwdGpio, calibrate(msg.speed));

		piblaster.setPwm(leftMotorFwdGpio, calibrate(msg.turn));
		piblaster.setPwm(leftMotorRwdGpio, 0);
		console.log('Turning right ...' + calibrate(msg.turn) + ' speed ' + calibrate(msg.speed));

		// turn left
	} else if (msg.turn > 20) {
		piblaster.setPwm(leftMotorFwdGpio, calibrate(msg.speed));

		piblaster.setPwm(rightMotorFwdGpio, calibrate(msg.turn));
		piblaster.setPwm(rightMotorRwsGpio, 0);
		console.log('Turning left ...' + calibrate(msg.turn) + ' speed ' + calibrate(msg.speed));
	} else {
		piblaster.setPwm(leftMotorFwdGpio, calibrate(msg.speed));
		piblaster.setPwm(leftMotorRwdGpio, 0);
		piblaster.setPwm(rightMotorFwdGpio, calibrate(msg.speed));
		piblaster.setPwm(rightMotorRwsGpio, 0);
		console.log('Stopping ...' + calibrate(msg.turn) + ' speed ' + calibrate(msg.speed));
	}

}

function calibrate(turn) {

	if (turn == 0)
		return 0;

	if (turn < 0)
		turn = turn * -1;

	var out = turn + 30;

	if (out > 100)
		out = 100;

	return out / 100;
}

var port = 5000;
var version = "1.3";

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('url');

var piblaster = require('pi-blaster.js');

var leftMotorFwdGpio = 4;
var leftMotorRwdGpio = 17;

var rightMotorFwdGpio = 18;
var rightMotorRwdGpio = 21;

var sonicTriggGpio = 19;
var sonicEchoGpio = 26;

console.log('*** Starting PiLabServer node on port ' + port + '...');

var msg = {
	speed : 0,
	turn : ""
};

stop(msg);

try {
	var usonic = require('r-pi-usonic');
	var sensor = usonic.createSensor(sonicEchoGpio, sonicTriggGpio, 450);
	var distance = sensor();
	setTimeout(function() {
		console.log('Distance: ' + distance + ' cm');
	}, 500);
} catch (e) {
	console.log('Error: ' + e.message);
}

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
	socket.emit('connected', {sockedId:socket.id, ip:socket.request.connection.remoteAddress});
	
	socket.on('command', function(msg) {
		// console.log("on command... " + msg.turn);

		// var msg = JSON.parse(msg);
		msg.ip = socket.request.connection.remoteAddress;
		moveCar(msg);
		socket.broadcast.emit('move', msg);
	});

});

http.listen(port, function() {
	console.log('** PiLabServer ' + version + ' listening on:' + port + ' ...');
});

function moveCar(msg) {

	// turn right
	if (msg.turn < -20) {
		rightTurn(msg);

		// turn left
	} else if (msg.turn > 20) {
		leftTurn(msg);

	} else {
		if (msg.speed < -20 && msg.speed < 0)
			rwd(msg);
		else if (msg.speed > 20 && msg.speed > 0)
			fwd(msg);
		else
			stop(msg);
	}

}

function stop(msg) {
	piblaster.setPwm(leftMotorFwdGpio, 0);
	piblaster.setPwm(leftMotorRwdGpio, 0);

	piblaster.setPwm(rightMotorFwdGpio, 0);
	piblaster.setPwm(rightMotorRwdGpio, 0);
	
	socket.emit('disconnected', {sockedId:socket.id, ip:socket.request.connection.remoteAddress});
	console.log('Stopping ...' + calibrate(msg.turn) + ' speed ' + calibrate(msg.speed));
}

function leftTurn(msg) {
	// left back
	 piblaster.setPwm(leftMotorFwdGpio, 0);
	 piblaster.setPwm(leftMotorRwdGpio, calibrate(msg.turn));

	var turnCalculated = calibrate(msg.turn) - 0.2;

//	piblaster.setPwm(leftMotorFwdGpio, turnCalculated);
//	piblaster.setPwm(leftMotorRwdGpio, 0);

	// right fwd
	piblaster.setPwm(rightMotorFwdGpio, calibrate(msg.turn));
	piblaster.setPwm(rightMotorRwdGpio, 0);
	console.log('Turning left ... R:' + calibrate(msg.turn) + ' L:' + turnCalculated + ', speed ' + calibrate(msg.speed));
}

function rightTurn(msg) {
	// right back
	 piblaster.setPwm(rightMotorRwdGpio, calibrate(msg.turn));
	 piblaster.setPwm(rightMotorFwdGpio, 0);

	 var turnCalculated = calibrate(msg.turn) - 0.2;
//	 piblaster.setPwm(rightMotorFwdGpio, turnCalculated);
//	 piblaster.setPwm(rightMotorRwdGpio, 0);

	// left fwd
	piblaster.setPwm(leftMotorFwdGpio, calibrate(msg.turn));
	piblaster.setPwm(leftMotorRwdGpio, 0);
	console.log('Turning right ... R:' + turnCalculated + ' L:' + calibrate(msg.turn) + ', speed ' + calibrate(msg.speed));
}

function fwd(msg) {
	piblaster.setPwm(leftMotorFwdGpio, calibrate(msg.speed));
	piblaster.setPwm(leftMotorRwdGpio, 0);
	piblaster.setPwm(rightMotorFwdGpio, calibrate(msg.speed));
	piblaster.setPwm(rightMotorRwdGpio, 0);
	console.log('FWD ...' + calibrate(msg.turn) + ', speed ' + calibrate(msg.speed));
}

function rwd(msg) {
	piblaster.setPwm(leftMotorFwdGpio, 0);
	piblaster.setPwm(leftMotorRwdGpio, calibrate(msg.speed));
	piblaster.setPwm(rightMotorFwdGpio, 0);
	piblaster.setPwm(rightMotorRwdGpio, calibrate(msg.speed));
	console.log('RWD ...' + calibrate(msg.turn) + ', speed ' + calibrate(msg.speed));
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
};

function exitHandler(options, err) {
	if (options.cleanup) {
		stop(msg);
		console.log('** PiLabServer closing down ...');
	}
	if (err)
		console.log(err.stack);
	if (options.exit)
		process.exit();
}

// do something when app is closing
process.on('exit', exitHandler.bind(null, {
	cleanup : true
}));

// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {
	exit : true
}));

// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {
	exit : true
}));

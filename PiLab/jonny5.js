//jonny five
console.log("jonny five init ...");
var raspi = require('raspi-io');
var five = require('johnny-five');
var board = new five.Board({
	io : new raspi()
});

board.on('ready', function() {
	console.log("jonny five board ready ...");
	// Create an Led on pin 7 (GPIO4) on P1 and strobe it on/off
	// Optionally set the speed; defaults to 100ms
	var led = new five.Led('GPIO16');
	
	led.blink(90);

});
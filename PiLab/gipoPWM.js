var http = require('http');
var url = require('url');
var piblaster = require('pi-blaster.js');

var gipo1 = 4;
var gipo2 = 17;
var port = 5001;
var i = 0;

http.createServer(function(req, res) {

	res.writeHead(200, {
		'Content-Type' : 'text/html'
	});
	var brightness = url.parse(req.url).pathname.slice(1);
	console.log("Seting brithnes: " + brightness + "%");

	if (brightness.length === 0 || isNaN(brightness)) {
		piblaster.setPwm(gipo1, 0);
		piblaster.setPwm(gipo2, 0);
		res.end('hello? yes, this is pi on ' + port + ' try=' + i++);
	} else {
		piblaster.setPwm(gipo1, brightness / 100);
		piblaster.setPwm(gipo2, (100 - brightness) / 100);

		console.log("Seting brithnes: " + brightness + "% | " + (100 - brightness) + "%");
		res.end('Brightness set to: ' + brightness + '%');
	}

}).listen(port, function() {
	console.log('** gipoPWM listening on:' + port + ' ...');
	piblaster.setPwm(gipo1, 0);
	piblaster.setPwm(gipo2, 0);
	
});
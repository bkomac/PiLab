'use strict';


function trace(msg) {
	console.log("TRACE: " + msg);
};
function debug(msg) {
	if (LOG_LEVEL <= LogLevel.DEBUG)
		console.log("DEBUG: " + msg);
}
function warn(msg) {
	if (LOG_LEVEL <= LogLevel.WARN)
		console.warn("WARN: " + msg);
}
function error(msg) {
	console.error("***ERROR: " + msg);
};

function echo(object, prepend) {
	if (prepend == undefined)
		prepend = "";
	trace(prepend + "->" + JSON.stringify(object));
}

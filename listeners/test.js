var events = require("events");
var eventEmitter = new events.EventEmitter();

module.exports.eventName = "test";

module.exports.shouldEmit = function () {
	eventEmitter.emit(module.exports.eventName, {"sendMessage": "Test event emitted if subscribed to."});
}

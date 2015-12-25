var events = require("events");
var eventEmitter = new events.EventEmitter();
var async = require('async');
var subs = require("../subscriptions.json");
var listeners = require("./listeners");

chatApp({email: loginInfo.email, password: loginInfo.password, forceLogin: true}, function (err, api) {
	async.forEach(JSON.parse(subs)['subsList'], function (sub, cb) {
		var listener = listeners.find(function (current, index, array) { 
			return current.eventName == sub['listenerName'];
		});
		eventEmitter.on(listener['eventName'], function (retJson) {
				api.sendMessage(retJson['sendMessage']);
			});
		);
	}, function () {

	});
		var timer = setInterval(function () {

		}, 10000);
});

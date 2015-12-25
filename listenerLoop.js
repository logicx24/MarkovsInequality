var events = require("events");
var eventEmitter = new events.EventEmitter();
var async = require('async');
var subs = require("../subscriptions.json");
var listeners = require("./listeners");

chatApp({email: loginInfo.email, password: loginInfo.password, forceLogin: true}, function (err, api) {
	async.forEach(JSON.parse(subs)['subsList'], function (sub, cb) {
		eventEmitter.on(listeners.find(function (current, index, array) { 
			return current.eventName == sub['listenerName'];
		})['eventName'], function (retJson) {
			api.sendMessage(retJson['sendMessage']);
		});
		setImmediate(cb);
	}, function () {
		JSON.parse(subs)['subsList'].forEach(function (sub) {
			var listened = listeners.find(function (current, index, array) { 
				return current.eventName == sub['listenerName'];
				var timer = setInterval(listened['shouldEmit'], sub['timeout']);
			});
			
		});
	});
});

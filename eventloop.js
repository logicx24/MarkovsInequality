var chatApp = require("facebook-chat-api");
var async = require("async");
var loginInfo = require("./login");
var functions = require("./functions");

chatApp({email: loginInfo.email, password: loginInfo.password, forceLogin: true}, function (err, api) {
	if (err) console.log(err);
	api.listen(function (err, message) {
		async.forEach(functions, function (func, callback) {
			if (message.body.match(func.matchPattern)) {
				func.action(api, message, callback);
			}
			else {
				setImmediate(callback);
			}
		});
	});
});

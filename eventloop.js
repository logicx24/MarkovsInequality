var chatApp = require("facebook-chat-api");
var async = require("async");
var loginInfo = require("./login");
var functions = require("./functions");

chatApp({email: loginInfo.email, password: loginInfo.password}, function (err, api) {
	if (err) console.log(err);
	api.listen(function (err, message) {
		async.eachSeries(functions, function (func, callback) {
			if (message.body.match(func.matchPattern)) {
				func.action(api, message, callback);
			}
			else {
				setImmediate(callback);
			}
		});
	});
});

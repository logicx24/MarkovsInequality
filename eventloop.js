var chatApp = require("facebook-chat-api");
var async = require("async");
var loginInfo = require("./login");
var functions = require("./functions");

chatApp({email: loginInfo.email, password: loginInfo.password}, function (err, api) {
	if (err) console.log(err);
	api.listen(function (err, message) {
		if (message.body == "/test") {
			api.sendMessage("/test response: Pandas: cuddly, but murderous.", message.threadID);
		}
	});
});

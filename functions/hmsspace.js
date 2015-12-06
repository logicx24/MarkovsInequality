var key = require("../login")['hmsspacekey'];
var email = require("../login")['creatoremail'];
var request = require("request");

module.exports.matchPattern = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

module.exports.action = function (api, message, cb) {
	var target = "http://hms.space/api/add";
	var toShorten = message.body.split(module.exports.matchPattern);
	request.post({
		url: target,
		form: {"apiKey": key, "creator": message.senderName, "target": message.body}
	}, function(err, httpResponse, body){
		if (err) {
			console.log(err);
			return setImmediate(cb);
		} else {
			var res = JSON.parse(body);
			if (res["Success"]) {
				api.sendMessage(res["ResultURL"], message.threadID);
				return setImmediate(cb);
			} else {
				console.log(res);
				api.sendMessage("hms.space fucked up. Blame @jordon wing.", message.threadID);
			}
		}
	});
}

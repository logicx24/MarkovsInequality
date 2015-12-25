//var subsList = require("./subscriptions.json");
var fs = require('fs');

module.exports.matchPattern = /\/subscribe/;

module.exports.action = function (api, message, cb) {
	var subs = JSON.parse(fs.readFileSync("../subscriptions.json"));
	subs["subsList"].push({"listenerName": message.split(" ")[1], "timeout": message.split(" ")[2]});
	fs.writeFileSync("../subscriptions.json", JSON.stringify(subs));
	return setImmediate(cb);
}

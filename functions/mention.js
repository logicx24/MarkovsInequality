async = require("async");

module.exports.matchPattern = /@/;
//@name lastname must be how you mention someone. Multiple mentions also work.
module.exports.action = function (api, message, cb) {
	async.eachSeries(message.body.split(module.exports.matchPattern).slice(1), function (frag, callback) {
		mentioned = frag.split(" ").slice(0,2).join(" ");
		api.getUserID(mentioned, function (err, ids) {
			if (err) {
				console.log(err);
				return setImmediate(callback);
			} else {
				var validID = ids[0];
				api.getUserInfo(message['senderID'], function (err, info) {
					if (err) {
						console.log(err);
						return setImmediate(callback);
					}
					else {
						messageText = "This the HMS facebook bot. You have been mentioned by " + info[Object.getOwnPropertyNames(info)[0]].name + " in the group chat " + message.threadName + ". Here was the message: '" + message.body + "' \n\n If you believe this was done in error, please ignore this.";
						api.sendMessage(messageText, validID['userID']);
						setImmediate(callback);
					}
				});
			}
		});
	}, cb);
}

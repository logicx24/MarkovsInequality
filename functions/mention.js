async = require("async");

module.exports.matchPattern = /@/;
//@name lastname must be the format for mentions. They can be put in the middle of sentences. Multiple mentions also work.
module.exports.action = function (api, message, cb) {
	async.eachSeries(message.body.split(module.exports.matchPattern).slice(1), function (frag, callback) {
		mentioned = frag.split(" ").slice(0,2).join(" ");
		api.getUserID(mentioned, function (err, ids) {
			if (err) {
				console.log(err);
				return setImmediate(callback);
			} else if (message.participantIDs.indexOf(parseInt(ids[0]['userID'])) < 0) {
				// console.log(message.participantIDs);
				// console.log(ids[0]['userID']);
				// console.log(message.participantIDs.indexOf(parseInt(ids[0]['userID'])));
				console.log("You can only mention people that are in the current thread.");
				api.sendMessage("You can only mention people that are in the current thread.", message.threadID);
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
						return setImmediate(callback);
					}
				});
			}
		});
	}, cb);
}

var markov = require("../markov");

module.exports.matchPattern = /\/markov\s+/;
//todo: get thread history, serialize and cache it, with person mapped to history. 
//or get thread history, generate 

module.exports.action = function (api, message, cb) {
	var tID = message.threadID;
	var frag = message.body.split(module.exports.matchPattern).slice(1)[0];
	var mentioned = frag.split(" ").slice(0,2).join(" ");
	var msgHistory = "";
	api.getUserID(mentioned, function (err, id) {
		if (err) {
			console.log(err);
			return setImmediate(cb);
		} else {
			api.getThreadHistory(tID, 0, 1000, Date.now(), function (err, data) {
				//Bucket each message by sender id
				//train markov chain on it
				//send message with text
				//also implement wordclouds - cache message history for that.
				if (err) {
					console.log(err);
					return setImmediate(cb);
				} else {
					var validID = id[0]['userID'];
					async.eachSeries(data, function (msg, next) {
						if (msg.senderID.split(":")[1] == validID && msg.body.indexOf("/") < 0) {
							msgHistory += msg.body;
							msgHistory += " ";
							setImmediate(next);
						} else {
							setImmediate(next);
						}
						
					}, function () {
						var mb = markov.MarkovBot(msgHistory);
						api.sendMessage(mb.textGen(300), message.threadID);
						return setImmediate(cb);
					});

				}
			});
		}
	});
}

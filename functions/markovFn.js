module.exports.matchPattern = /\/markov/;
//todo: get thread history, serialize and cache it, with person mapped to history. 
//or get thread history, generate 

module.exports.action = function (api, message, cb) {
	var tID = message.threadID;
	api.getUserID(mentioned, function (err, ids) {
		api.getThreadHistory(tID, 0, 5000, Date.now(), function (err, data) {
			console.log(data);
			//Bucket each message by sender id
			//train markov chain on it
			//send message with text
			//also implement wordclouds - cache message history for that.
		});
	});
}

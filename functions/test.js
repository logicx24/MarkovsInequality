module.exports = {
	matchPattern: "/test",
	action: function (api, message, callback) {
			api.sendMessage("/test response: Pandas: cuddly, but murderous.", message.threadID);
			setImmediate(callback);
		}
}

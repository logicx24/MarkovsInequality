
module.exports.matchPattern = /\/subscribe/;

module.exports.action = function (api, message, cb) {
	return setImmediate(cb);
}

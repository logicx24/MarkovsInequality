module.exports.matchPattern = /\*shrug\*/g;

module.exports.action = function(api, message, cb) {
  if (message.body.indexOf("*shrug*") != -1) {
    api.sendMessage("¯\\_(ツ)_/¯", message.threadID);
  }
}

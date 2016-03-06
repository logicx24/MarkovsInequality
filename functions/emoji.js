module.exports.matchPattern = /(\*shrug\*)|(\/stare)/g;

module.exports.action = function(api, message, cb) {
  if (message.body.indexOf("*shrug*") != -1) {
    api.sendMessage("¯\\_(ツ)_/¯", message.threadID);
  } else if (message.body.indexOf("/stare") == 0) {
    var possibleName = message.body.split(" ")[1];
    var isName = false;
    if (possibleName) {
      for (var i in message.participantNames) {
        if (message.participantNames[i].split(" ")[0].toLowerCase() == possibleName) {
          isName = true;
        }
      }
    }

    var msg = "ಠ_ಠ";
    if (isName)
      msg = "@" + possibleName + ": " + msg;
    api.sendMessage(msg, message.threadID);
  }
}

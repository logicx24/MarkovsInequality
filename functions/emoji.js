/*
 * Module for emoji actions in the bot. 
 *
 * Currently very naive: the matchPattern just matches any occurrence of
 * any of the emoji triggers (e.g. *shrug*), then the action checks for the
 * presence of one of them. Note that it will only actually send a message for
 * the first trigger it finds, not all of them.
*/

module.exports.matchPattern = /(\*shrug\*)|(\/stare)|(\/lenny)/g;

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
  } else if (message.body.indexOf("/lenny") == 0) {
    api.sendMessage("( ͡° ͜ʖ ͡°  )", message.threadID);
  }
}

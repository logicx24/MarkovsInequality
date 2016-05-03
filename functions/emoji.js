/*
 * Module for emoji actions in the bot.
 *
 * Currently very naive: the matchPattern just matches any occurrence of
 * any of the emoji triggers (e.g. *shrug*), then the action checks for the
 * presence of one of them. Note that it will only actually send a message for
 * the first trigger it finds, not all of them.
*/

module.exports.matchPattern = /\/emoji/g;

module.exports.action = function(api, message, cb) {
  if (message.threadID !== message.senderID) {
    cb();
    return;
  }
  var emojis = [
    "¯\\_(ツ)_/¯",
    "ಠ__ಠ",
    "( ͡° ͜ʖ ͡° )"
  ];
  api.sendMessage(emojis.join("\r\n"), message.threadID);
}

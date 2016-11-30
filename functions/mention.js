async = require("async");
cache = require("../cache").cache;
// var DISALLOWED_MENTION_IDS = require("../login.js").DISALLOWED_MENTION_IDS;

module.exports.matchPattern = /@/;

function formatDateString() {
  var d = new Date();
  var datestr = "" + d.getDate() + "/" + d.getMonth();
  var timeOfDay = d.getHours() >= 12 ? "PM" : "AM";
  var minutes = ("0" + d.getMinutes()).slice(-2);
  var timestr = "" + d.getHours() + ":" + minutes;
  var dayOfWeekDict = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"]
  var dayOfWeek = dayOfWeekDict[d.getDay()]
  return dayOfWeek + ", " + datestr +
      " at " + timestr + " " + timeOfDay + ":";
}

function sendMentionMessage(api, mentionedName,
        mentionedID, message, hist, callback) {
  // if (DISALLOWED_MENTION_IDS.indexOf(mentionedID) != -1)
  //   return setImmediate(callback);
  if (mentionedID == message['senderID'] && mentionedName == "everyone")
    return setImmediate(callback);

  var senderName = cache.senderFromID(message.senderID);
  var threadName = cache.threadFromID(message.threadID);

  var brk = "\r\n"
  var messageText = formatDateString() + brk;

  messageText += "* "+ senderName + " *";
  if (mentionedName === "everyone")
    messageText += " group";
  messageText += brk + "mentioned you";

  if (message.threadID) {
    if (message.threadID === message.senderID) {
      messageText += " in " + brk + "your personal chat";
    } else {
      messageText += " in " + brk + threadName;
    }
  }
  messageText += ":" + brk;

  if (hist) {
    for (var i=0; i < hist.length; i++) {
      var msg = hist[i];
      var firstName = msg.senderName.split(" ")[0];
      messageText += "[" + firstName + "] " + msg.body + brk;
    }
  }
  api.sendMessage(messageText, mentionedID);

  return setImmediate(callback);
}

// @name lastname must be the format for mentions. They can be put in the
// middle of sentences. Multiple mentions also work.
module.exports.action = function (api, message, cb) {
  var start = 1;
  var end = 3; // get the last 2 messages
  api.getThreadHistory(message.threadID, start, end, message.timestamp,
  function(err, hist) {
    hist = err ? null : hist;
    var fragments = message.body.split(module.exports.matchPattern).slice(1);
    async.forEach(fragments, function (frag, callback) {
      if (frag.slice(0, 8) == "everyone") {
        var ids = cache.getAllParticipantIDs(message.threadID);
        for (var i=0; i < ids.length; i++)
          sendMentionMessage(api, "everyone", ids[i], message, hist, function(){});
        return setImmediate(callback);
      }
      mentioned = frag.split(" ").slice(0,2).join(" ");
      var id = cache.getIDFromName(mentioned);
      if (id)
        return sendMentionMessage(api, mentioned, id, message, hist, callback);
      id = cache.getIDFromName(mentioned.split(" ")[0]);
      if (id)
        return sendMentionMessage(api, mentioned, id, message, hist, callback);
      console.log ("id not found for " + mentioned);
    }, cb);
  });


}

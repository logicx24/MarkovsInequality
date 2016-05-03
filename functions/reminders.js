/*
 * Module for reminders.
 *
 * Not designed for robust string processing, and currently
 * just uses a setTimer call to set the reminder.
*/
var cache = require("../cache").cache;
module.exports.matchPattern = /^(F|f)rankie[,:]? remind me/g

var TIME_UNITS = {
  'day': 24*60*60,
  'days': 24*60*60,
  'hour': 60*60,
  'hours': 60*60,
  'minute': 60,
  'minutes': 60,
  'second': 1,
  'seconds': 1
}

toHHMMSS = function (date) {
  var hours   = (date.getHours() % 12);
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  //if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  var time    = hours+':'+minutes
  return time;

}

function getTimeArray(s) {
  var timeRegex = /(\d+):(\d+)[:(\d+)]?/g
  var match = timeRegex.exec(s);
  if (match === null)
    return null;
  console.log(match);

  var result = match.splice(1);
  result[0] = parseInt(result[0]);
  result[1] = parseInt(result[1]);
  if (result.length == 2)
    result.push(0);

  return result;
}


module.exports.action = function(api, message, cb) {
  if (message.threadID !== message.senderID) {
    cb();
    return;
  }

  var tokens = message.body.split(" ").splice(1);

  var stage = 1;
  var timeValue, units, numSeconds;
  var timeFormat = "delta";
  var msg = "";
  for (var i in tokens) {
    var token = tokens[i];

    if (stage == 1) {
      if (token == "in")
        continue;
      else if (token == "at") {
        timeFormat = "abs";
        continue;
      }

      if (timeFormat == "abs") {
        var timeArray = getTimeArray(token);
        if (timeArray == null) {
          break;
        }

        var timerDate = new Date();
        timerDate.setHours(timeArray[0]);
        timerDate.setMinutes(timeArray[1]);
        timerDate.setSeconds(timeArray[2]);

        //console.log(timeArray);
        //console.log(timerDate);

        numSeconds = Math.round((timerDate - new Date()) / 1000);
        //console.log(numSeconds);
        if (numSeconds < 0)
          break;
        stage = 2;
      } else if (timeFormat == "delta") {
        var t = parseInt(token);
        if (!timeValue && !isNaN(t) && t != 0) {
          timeValue = t;
          continue;
        } else if (TIME_UNITS[token]) {
          units = token;
          numSeconds = timeValue * (TIME_UNITS[token]);
          stage = 2;
        }
      }
    } else {
      if (msg != "")
        msg += " "
      msg += token;
    }
  }

  if (stage != 2 || msg == "") {
    // Bad reminder.
    api.sendMessage("Bad reminder. Format: " +
        "Frankie remind me in <time> to <action>", message.threadID);
    return;
  }

  var reminderTime = new Date();
  reminderTime.setSeconds(reminderTime.getSeconds() + numSeconds);

  var timeStr = toHHMMSS(reminderTime);
  //reminderTime.getHours() + ":" + reminderTime.getMinutes();
  api.sendMessage("I'll remind you at " + timeStr, message.threadID);

  setTimeout(function() {
    api.sendMessage("You asked me to remind you " + msg +
        " at " + timeStr, message.senderID);
  }, numSeconds * 1000);
}

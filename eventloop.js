var chatApp = require("facebook-chat-api");
var async = require("async");
// var loginInfo = require("./login");
var functions = require("./functions");
var cache = require("./cache").cache;
var sleep = require('sleep');

var bus = require("./eventBus");

var loginOptions = {
  forceLogin: true,
  logLevel: "info"
}

module.exports.createBot = function (botObject, next) {
  credentials = {
    email: botObject.email,
    password: botObject.password
  }
  return chatApp(credentials, loginOptions, function(err, api) {
    if (err) {
      return bus.emit("starting_error", err, botObject.id);
    }
    console.log("Create api object");
    currentBots[botObject.id].api = api;
    next(botObject);
  });
}

module.exports.startBot = function (botObject) {
  if (botObject.api == undefined) {
    bus.emit("error", {"error": "API object is undefined"}, botObject.id);
  }
  var killfn = botObject.api.listen(function (err, message) {
    if (err) {
      bus.emit("error", err, botObject.id);
    }
    cache.load(botObject.api, message.threadID, function() {
      for (var f in functions) {
        var func = functions[f];
        var callback = function(){};
        if (message.body && message.body.match(func.matchPattern)) {
          func.action(botObject.api, message, callback);
        }
      };
    });
  });

  botObject.killFunc = killfn;
  return botObject.id;
}


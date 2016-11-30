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

module.exports.createBot = function (botObject, cb) {
  credentials = {
    email: botObject.email,
    password: botObject.password
  }
  chatApp(credentials, loginOptions, function(err, api) {
    if (err) {
      bus.emit("starting_error", botObject.id);
      return;
    }
    console.log("Create api object");
    //bus.emit("api", api, botObject.id);
    currentBots[botObject.id].api = api;
    cb(botObject);
  });
}

module.exports.startBot = function (botObject) {
  if (botObject.api == undefined) {
    console.log("Incorrect Login");
  }
  botObject.api.listen(function (err, message) {
    console.log("message!")
    if (err) {
      console.error(err);
      //process.exit(-1);
      bus.emit("error", botObject.id);
    }
    cache.load(botObject.api, message.threadID, function() {
      console.log(message.threadID)
      for (var f in functions) {
        var func = functions[f];
        var callback = function(){};
        if (message.body && message.body.match(func.matchPattern)) {
          func.action(botObject.api, message, callback);
        } else if (!message.body) {
          console.log("sticker!");
        }
      };
    });
  });
}

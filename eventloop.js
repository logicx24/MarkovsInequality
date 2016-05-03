var chatApp = require("facebook-chat-api");
var async = require("async");
var loginInfo = require("./login");
var functions = require("./functions");
var cache = require("./cache").cache;

console.log('Logging In')

chatApp({email: loginInfo.email, password: loginInfo.password}, function (err, api) {
  if (err) {
    console.log(err);
  } else {
    console.log("Starting Listening")
    api.listen(function (err, message) {
      console.log("message!")
      if (err) {
        console.error(err);
        process.exit(-1);
      }

      cache.load(api, message.threadID, function() {
        // console.log(cache.namesCache)
        // console.log(cache.threadsCache)
        for (var f in functions) {
          var func = functions[f];
          var callback = function(){};
          if (message.body && message.body.match(func.matchPattern)) {
            func.action(api, message, callback);
          } else if (!message.body) {
            console.log("sticker!");
          }
        };
      });

    });
  }
});

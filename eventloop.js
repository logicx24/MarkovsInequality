var chatApp = require("facebook-chat-api");
var async = require("async");
// var loginInfo = require("./login");
var functions = require("./functions");
var cache = require("./cache").cache;
var sleep = require('sleep');

console.log('Logging In')

var email = process.env.BOT_EMAIL;
var password = process.env.BOT_PASSWORD;

var readline = require("readline");
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var loginApprovalCode = process.env.LOGIN_APPROVAL_CODE
console.log(loginApprovalCode)

chatApp({email: email, password: password}, function (err, api) {
  if(err) {
    switch (err.error) {
      case 'login-approval':
        console.log("APPROVE LOGIN ON FACEBOOK NOW!");
        sleep.sleep(30);
        err.continue(loginApprovalCode);
        break;
    }
    return;
  }

  api.setOptions({
      forceLogin: true,
      logLevel: "info"
    });

  console.log("Starting Listening")
  api.listen(function (err, message) {
    console.log("message!")
    if (err) {
      console.error(err);
      process.exit(-1);
    }

    cache.load(api, message.threadID, function() {
      console.log(message.threadID)
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


});

// to satisfy the heroku gods...

var express = require('express');
var app     = express();

app.set('port', (process.env.PORT || 5000));

// For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});

// Prevent Heroku App from sleeping
var http = require("http");
setInterval(function() {
    http.get("http://fbchatscanner.herokuapp.com");
}, 300000); // every 5 minutes (300000)


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
  var time;
  if(err) {
    switch (err.error) {
      case 'login-approval':
        console.log("APPROVE LOGIN ON FACEBOOK NOW!");
        time = 30;
        for (time=30; time > 0; time--) {
          console.log("time left to approve: " + time)
          sleep.sleep(1);
        }
        err.continue(loginApprovalCode);
        break;
    }
    return;
  } else {
    console.log("APPROVE LOGIN ON FACEBOOK NOW!");
    time = 30;
    for (time=30; time > 0; time--) {
      console.log("time left to approve: " + time)
      sleep.sleep(1);
    }
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

var chatApp = require("facebook-chat-api");
var async = require("async");
var loginInfo = require("./login");
var functions = require("./functions");

chatApp({email: loginInfo.email, password: loginInfo.password}, function (err, api) {
    if (err) {
        console.log(err);
    } else {
        api.listen(function (err, message) {
            if (err) {

                console.error(err);
                process.exit(-1);
            }
            else {
                for (var f in functions) {
                    var func = functions[f];
                    var callback = function(){};
                    if (message.body.match(func.matchPattern)) {
                        func.action(api, message, callback);
                    }
                    else if (func['onMessage']) {
                      func.onMessage(api, message);
                    }
                };
            }
        });
    }
});

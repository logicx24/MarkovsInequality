var key = require("../login")['hmsspacekey'];
var email = require("../login")['creatoremail'];
var request = require("request");

module.exports.matchPattern = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

module.exports.action = function (api, message, cb) {
	var target = "http://hms.space/api/add";
	var allLinks = message.body.match(module.exports.matchPattern);
    for (var i in allLinks) {
        var toShorten = allLinks[i];
        request.post({
            url: target,
            form: {
                "apiKey": key,
                "creator": message.senderName,
                "target": toShorten,
                "chatID": message.threadID,
                "chatName": message.threadName,
            }
        }, function(err, httpResponse, body){
            if (err) {
                console.log(err);
                return setImmediate(cb);
            } else {
                var res = JSON.parse(body);
                if (res["Success"]) {
                    var url = res["ResultURL"];
                    api.sendMessage(url, message.threadID);
                    return setImmediate(cb);
                } else {
                    console.error(res)
                    api.sendMessage("hms.space fucked up. Blame @jordon wing.", message.threadID);
                }
            }
        });
    }
}

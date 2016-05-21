var key = require("../login")['musicfrontendkey'];
var email = require("../login")['creatoremail'];
var request = require("request");
var cache = require("../cache").cache;

module.exports.matchPattern =
/\b(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?\b/g;

module.exports.action = function (api, message, cb) {
    var target = "http://localhost:6543/recommendations/new";
    var allLinks = message.body.match(module.exports.matchPattern);
    for (var i in allLinks) {
        var toShorten = allLinks[i];
        var senderName = cache.senderFromID(message.senderID);
        var threadName = cache.threadFromID(message.threadID);
        var timestampUTC = Date.now()
        request.post({
            url: target,
            form: {
                "api_key": key,
                "creator": senderName,
                "date_created":timestampUTC,
                "link": toShorten,
                // "chat_id": message.threadID,
                // "chat_name": threadName,
            }
        }, function(err, httpResponse, body){
            if (err) {
                console.log(err);
                return setImmediate(cb);
            } else {
                console.log(body)
                // var res = JSON.parse(body);
                // if (res["Success"]) {
                //     var url = res["ResultURL"];
                //     // DO NOT send messages; will get banned if so.
                //     // api.sendMessage("logged: " + url, message.threadID);
                //     return setImmediate(cb);
                // } else {
                //     if (body.indexOf("redirect loops") != -1)
                //         return setImmediate(cb);
                //     console.error(res);
                //     // api.sendMessage("Eric's music frontend fucked up.",
                //     //     message.threadID);
                // }
            }
        });
    }
}

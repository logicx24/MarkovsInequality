// var key = require("../login")['musicfrontendkey'];
// var email = require("../login")['creatoremail'];
var request = require("request");
var cache = require("../cache").cache;

module.exports.matchPattern =
/\b([A-Za-z]{3,9}):\/\/([-;:&=\+\$,\w]+@{1})?([-A-Za-z0-9\.]+)+:?(\d+)?((\/[-\+~%/\.\w]+)?\??([-\+=&;%@\.\w]+)?#?([\w]+)?)?\b/g;

var key = process.env.FBMUSIC_API_KEY

function contains(string, word) {
    return string.indexOf(word) !== -1;
}

function getUrlType(url) {
    if (contains(url, "songl.ink"))
        return "songlink";
    else if (contains(url, "youtube.com/watch") || contains(url, "youtu.be"))
        return "youtube";
    else if (contains(url, "open.spotify.com/track"))
        return "spotify"
    else
        return "other"
}

// ASSUMPTION:  only one music chat exists.
module.exports.action = function (api, message, cb) {
    if (message.threadID != process.env.FBCHAT_ID) {
        return;
    }
    console.log("message received from Music chat");
    var target = "https://fbmusic.herokuapp.com/recommendations";
    var allLinks = message.body.match(module.exports.matchPattern);
    for (var i in allLinks) {
        var link = allLinks[i];
        if (getUrlType(link) === "other")
            continue;

        console.log("attemptiong upload of nnew link " + link + "...");
        var senderName = cache.senderFromID(message.senderID);
        var threadName = cache.threadFromID(message.threadID);
        var timestampUTC = Date.now()
        console.log(senderName);
        console.log(timestampUTC);
        request.post({
            url: target,
            form: {
                "api_key": key,
                "creator": senderName,
                "date_created":timestampUTC,
                "link": link,
                // "chat_id": message.threadID,
                // "chat_name": threadName,
            }
        }, function(err, httpResponse, body){
            if (err || httpResponse.statusCode === 404) {
                console.log(body);
                return console.error('upload failed:', err);
            } else {
                console.log('upload successful!');
            }
        });
    }
}

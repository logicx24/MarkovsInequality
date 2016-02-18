async = require("async");
cache = require("../mentionsCache");
var DISALLOWED_MENTION_IDS = require("../login.js").DISALLOWED_MENTION_IDS;

module.exports.matchPattern = /@/;
var idCache = new cache.MentionsCache();

function sendMentionMessage(api, mentionedName, mentionedID, message, callback) {
    if (DISALLOWED_MENTION_IDS.indexOf(mentionedID) != -1)
        return setImmediate(callback);
    api.getUserInfo(message['senderID'], function (err, info) {
        if (err) {
            console.log(err);
            return setImmediate(callback);
        }
        else {
            var mentionedFullName = info[Object.getOwnPropertyNames(info)[0]].name;
            var messageText = mentionedFullName;
            
            if (mentionedName == "everyone")
                messageText += " group";

            messageText += " mentioned you";
            if (message.threadName) {
                if (message.threadName == mentionedFullName) {
                    messageText += " in your personal chat";
                } else {
                    messageText += " in " + message.threadName;
                }
            }
            messageText += ": " + message.body;
            api.sendMessage(messageText, mentionedID);
            idCache.addToCache(message.threadID, mentionedName, mentionedID);
            return setImmediate(callback);
        }
    });
}

function buildCache(api, threadID, participantIDs) {
    api.getUserInfo(participantIDs, function(err, results) {
        if (err) {
            console.error(err);
            return;
        }

        for (var userID in results) {
            idCache.addToCache(threadID, results[userID].name, userID);
        }
    });
}

module.exports.onMessage = function(api, message) {
    // Make sure we have the ID of everyone in the chat
    // Since get user info is asynchronous, this is technically a race condition on first load
    // But that's almost never going to be an issue.
    if (message.participantIDs.length > idCache.getSize(message.threadID))
      buildCache(api, message.threadID, message.participantIDs);
}

//@name lastname must be the format for mentions. They can be put in the middle of sentences. Multiple mentions also work.
module.exports.action = function (api, message, cb) {
    async.forEach(message.body.split(module.exports.matchPattern).slice(1), function (frag, callback) {

        if (frag.slice(0, 8) == "everyone") {
            var ids = idCache.getAllIDs(message.threadID);
            for (var i in ids) {
                sendMentionMessage(api, "everyone", ids[i], message, function(){});
            }
            return setImmediate(callback);
        }
        mentioned = frag.split(" ").slice(0,2).join(" ");
        var id = idCache.getID(message.threadID, mentioned);
        if (id)
            return sendMentionMessage(api, mentioned, id, message, callback);
        
        api.getUserID(mentioned, function (err, ids) {
            console.log("Had to fetch manually. Current cache: ", Object.keys(idCache[message.threadID] || {}));
            if (err) {
                console.log(err);
                var errstring = err['error'];
                //api.sendMessage({body: errstring}, message.threadID);
                return setImmediate(callback);
            } else if (message.participantIDs.indexOf(ids[0]['userID']) == -1 && message.participantIDs.indexOf(parseInt(ids[0]['userID'])) == -1) {
                console.log("You can only mention people that are in the current thread.");
                api.sendMessage("You can only mention people that are in the current thread.", message.threadID);
            } else {
                var validID = ids[0]['userID'];
                return sendMentionMessage(api, mentioned, validID, message, callback);
            }
        });
    }, cb);
}

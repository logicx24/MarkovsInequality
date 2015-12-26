async = require("async");

module.exports.matchPattern = /@/;

function getIDByFirstName(name, message) {
    var matchCount = 0;
    var matchIndex = -1;
    for (var i in message.participantNames) {
        if (name.toLowerCase() == message.participantNames[i].toLowerCase()) {
            matchCount++;
            matchIndex = i;
        }
    }
    
    if (matchCount == 1)
        return message.participantIDs[matchIndex];
    return null;
}

function sendMentionMessage(api, mentionedName, mentionedID, message, callback) {
    api.getUserInfo(message['senderID'], function (err, info) {
        if (err) {
            console.log(err);
            return setImmediate(callback);
        }
        else {
            messageText = "This the HMS facebook bot. You have been mentioned by " + info[Object.getOwnPropertyNames(info)[0]].name + " in the group chat " + message.threadName + ". Here was the message: '" + message.body + "' \n\n If you believe this was done in error, please ignore this.";
            api.sendMessage(messageText, mentionedID);
            return setImmediate(callback);
        }
    });
}

//@name lastname must be the format for mentions. They can be put in the middle of sentences. Multiple mentions also work.
module.exports.action = function (api, message, cb) {
    async.forEach(message.body.split(module.exports.matchPattern).slice(1), function (frag, callback) {
        mentioned = frag.split(" ").slice(0,2).join(" ");
        var id = getIDByFirstName(mentioned.split(" ")[0], message);
        if (id)
            return sendMentionMessage(api, mentioned, id, message, callback);
        
        api.getUserID(mentioned, function (err, ids) {
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

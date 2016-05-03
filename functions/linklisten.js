var key = require("../login")['hmsspacekey'];
var email = require("../login")['creatoremail'];
var request = require("request");
var cache = require("../cache");

// var cache = new Cache();

module.exports.matchPattern = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

// First, checks if it isn't implemented yet.
if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

module.exports.action = function (api, message, cb) {
    var links = message.body.match(module.exports.matchPattern);
    for (var i=0; i < links.length; i++) {
        var link = links[i];
        console.log("found link! " + link);
    }
}

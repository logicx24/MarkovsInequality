/*
 * Songlinkify spotify and youtube links.
*/
var request = require('request');

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

/* detects any youtube or spotify links */
module.exports.matchPattern = /\b((https?:\/\/)?(www\.)?open\.spotify\.com\/track[^\s]+)|((https?:\/\/)?(www\.)?youtube\.com\/watch[^\s]+)|((https?:\/\/)?(www\.)?m\.youtube\.com\/watch[^\s]+)\b/g

module.exports.action = function(api, message, cb) {
  var allSongLinks = message.body.match(module.exports.matchPattern);
  var targetUrl = "http://music.hms.space/get_music_info?link="
  for (var i=0; i < allSongLinks.length; i++) {
    var link = allSongLinks[i];
    request(targetUrl + link, function(err, res, body) {
      if (!err && res.statusCode === 200) {
        var data = JSON.parse(body);
        if (data['songlink'] !== '') {
          var frankie_msg = String.format("{0} - {1}:  {2}" + Array(30).join(" "),
            data['artists'][0], data['title'], data['songlink']);
          api.sendMessage(frankie_msg, message.threadID);
        }
      }
    });
  }
}
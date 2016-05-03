var key = require("../login")['hmsspacekey'];
var http = require("http");

var matchPattern = /(?:^|\s)hms\/([a-zA-Z0-9]+)/;


module.exports.matchPattern = matchPattern;

module.exports.action = function(api, message, cb) {
  var expandPath = message.body.match(matchPattern)[1];
  var resolveEndpoint = "http://hms.space/api/resolve?apiKey=" + key + "&path=" + expandPath;
  var req = http.request(resolveEndpoint, function(response) {
    var body = '';
    response.on('data', function(chunk) {
      body += chunk;
    });

    response.on('end', function() {
      var parsed = JSON.parse(body);
      if (parsed.Success) {
        var msg = parsed.Result.TargetURL + " (from hms/" + expandPath + ")";
        api.sendMessage(msg, message.threadID);
      }
    })
  });
  req.end();
}

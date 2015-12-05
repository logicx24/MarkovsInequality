require("fs").readdirSync(__dirname + "/").forEach(function (filename) {
	if (filename.match(/\.js$/) && filename != "index.js") {
		var fname = filename.replace(".js", "");
		module.exports[fname] = require("./" + filename);
	}
});


var express = require("express");
var app = express();

var shortid = require("shortid");
var eventloop = require("./eventloop");
var bus = require("./eventBus");

currentBots = {};

function createBotObject(email, password, cb) {
	var botObject = {
    id: shortid.generate(),
    email: email,
    password: password
  }
  currentBots[botObject.id] = botObject;
  return botObject;
}

function startBotObject(botObject){
  eventloop.createBot(botObject, eventloop.startBot);
  return botObject.id;
}

bus.on("starting_error", function (botId) {
  //currentBots[botId].api.logout();
  console.log("Everything is fucked", botId);
});

bus.on("error", function (botId) {
  console.log("errors, errors everywhere")
  startBotObject(currentBots[botId]);
});

app.get("/create", function (req, res) { //?email=yourmother&password=isgay
  console.log(req.query);
  var botid = startBotObject(createBotObject(req.query.email, req.query.password));
  res.send("Success!", botid);
});

app.get("/kill", function (req, res) {
  currentBots[req.query.id].api.logout();
  delete currentBots[req.query.id];
  res.send("More dead than Harambe!");
});

app.get("/", function(req, res) {
  res.send("App is running!");
})

app.listen(3655);

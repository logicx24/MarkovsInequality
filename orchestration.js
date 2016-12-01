
var express = require("express");
var app = express();

var shortid = require("shortid");
var eventloop = require("./eventloop");
var bus = require("./eventBus");

var readline = require("readline");
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

function killBot(id) {
  currentBots[id].killFunc();
  currentBots[id].api.logout();
  delete currentBots[req.query.id];
}

function start(email, pass) {
  return startBotObject(createBotObject(email, pass));
}

bus.on("starting_error", function (err, botId) {
  //currentBots[botId].api.logout();
  console.log(err.error, botId);

    switch (err.error) {
      case 'login-approval':
        console.log("Go to facebook.com and enter a code for 2 factor-auth.");
        console.log('> ');
        rl.on('line', function(line) {
          err.continue(line);
          rl.close();
        });
        break;

      case "Wrong username/password.":
        console.log("Wrong email or password"); //Need to transmit to user somehow. 
    }
       
});

bus.on("error", function (botId) {
  var email = currentBots[botId].email;
  var pass = currentBots[botId].password;
  killBot(botId);
  start(email, pass);
});

app.get("/create", function (req, res) { //?email=yourmother&password=isgay
  var botid = start(req.query.email, req.query.password);
  res.send("Success!", botid);
});


app.get("/kill", function (req, res) {
  killBot(req.query.id);
  res.send("More dead than Harambe!");
});

app.get("/", function(req, res) {
  res.send("App is running!");
})

app.listen(3655);

var Cache = function() {
  this.api = undefined;
  this.namesCache = {}; // id : name
  this.threadsCache = {}; // id : {name : threadName, ids : participantIDs}
}

Cache.prototype.addNamesInfo = function(participantIDs, cb) {
  var cache = this.namesCache;
  var newIDs = [];
  for (var i=0; i < participantIDs.length; i++) {
    var id = participantIDs[i];
    if (!cache[id])
      newIDs.push(id);
  }
  if (newIDs.length > 0) {
    this.api.getUserInfo(newIDs, function(err, ret) {
      if (err) return console.error(err);
      for (var id in ret)
        if (ret.hasOwnProperty(id))
          cache[id] = ret[id].name;
      cb();
    });
  } else {
    cb();
  }
}

Cache.prototype.addThreadInfo = function(threadID, cb) {
  var callback = function(err, ret) {
    if (err) return console.error(err);
    this.threadsCache[threadID] = {
      'name':ret.name,
      'ids':ret.participantIDs}
    this.addNamesInfo(ret.participantIDs, cb);
  }
  this.api.getThreadInfo(threadID, callback.bind(this));
};

Cache.prototype.load = function(api, threadID, cb) {
  // all code that relies on names being in the cache should be
  // called in the callback (cb) of this function to ensure no
  // cache misses.
  if (this.api === undefined)
    this.api = api;
  if (!this.threadsCache[threadID]) {
    this.addThreadInfo(threadID, cb);
  } else {
    cb();
  }
}

Cache.prototype.getAllParticipantIDs = function(threadID) {
  return this.threadsCache[threadID].ids;
}

Cache.prototype.senderFromID = function(senderID) {
  return this.namesCache[senderID];
}

Cache.prototype.threadFromID = function(threadID) {
  return this.threadsCache[threadID].name;
}

Cache.prototype.getIDFromName = function(name) {
  name = name.toLowerCase();
  var match = undefined;
  var matchNum = 0;
  for (var id in this.namesCache) {
    if (this.namesCache.hasOwnProperty(id)) {
      var cacheName = this.namesCache[id].toLowerCase();
      if (cacheName === name)
        return id;
      var firstName = cacheName.split(" ")[0];
      if (firstName === name) {
        if (!match)
          match = id;
        else
          return null; // match on first name must be ambiguous
      }
    }
  }
  return match;
}

var cache = new Cache();
module.exports.cache = cache;

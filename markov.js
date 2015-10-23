
var MarkovBot = function (text) {

	this.txt = text.replace(/[,-\/#!$%\^&\*;:{}=\-_`~()]/g,"");
	this.words = this.txt.split(" ");
	this.cache = this.database();

}

MarkovBot.prototype.triples = function () {
	var w = 0;
	var words = this.words;

	if (this.words.length < 3) {
		return;
	} 
	else {
		return {
			next : function () {
				return w < words.length - 3 ?
						{triple: [words[w], words[w+1], words[w+2]], ind: w++, done: false} :
						{done: true}
			}
		}
	}
}

MarkovBot.prototype.database = function () {
	this.cache = {};
	var iter = this.triples();
	var currTrip = iter.next();
	while (!currTrip.done) {
		triple = currTrip.triple;
		w1 = triple[0];
		w2 = triple[1];
		w3 = triple[2];
		if (w1+"_"+w2 in this.cache) {
			this.cache[w1+"_"+w2].push(w3);
		} else {
			this.cache[w1+"_"+w2] = [w3];
		}
		currTrip = iter.next();
	}
}

MarkovBot.prototype.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

MarkovBot.prototype.textGen = function (maxlen) {
	var genWords = [];
	if (this.words.length <= 1) {
		return "Get on the chat more you fuckwit. Jesus christ. I've had it up to here with your shit. Stupid dicknugget.";
	}
	var seedIndex = this.getRandomInt(0, this.words.length-2);
	var firstWord = this.words[seedIndex];
	var secondWord = this.words[seedIndex+1];
	for (var i = 0; i < Math.min(maxlen, this.words.length); i++) {
		if (firstWord+"_"+secondWord in this.cache) {
			var resList = this.cache[firstWord+"_"+secondWord];
			var resultant = resList[Math.floor(Math.random()*resList.length)];
			genWords.push(resultant);
			tmp = this.cache[firstWord+"_"+secondWord];
			firstWord = secondWord;
			secondWord = tmp[Math.floor(Math.random()*tmp.length)];
		}
	}

	return genWords.join(" ");

}

mark = new MarkovBot("word adf adga aer ab agre gre tgwf ab aeef 4t re sb rfe f hrtg er");
mark.database();
mark.textGen(20);







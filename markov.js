
var MarkovBot = function (text) {

	this.cache = {};
	this.txt = text.replace(/[,-\/#!$%\^&\*;:{}=\-_`~()]/g,"");
	this.words = this.txt.split(" ");

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



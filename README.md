This is very first iteration of a fully featured facebook messenger bot that will fix all the deficiences I always saw in facebook messenger. Currently, it's quite limited: all I've implemented so far are mentions (tagging people in chat using @ a' la' Slack), a function to automatically archive and shorten any links posted in the group chat using hms.space, a service written by a friend ([found here](https://github.com/jordonwii/cuddly-succotash)), and a function to train a markov chain using a person's messages and generate text in their style. 

It's very easy to extend the bot: just add a function in the functions folder, with two exposed attributes: a matchPattern that'll trigger the function, and the action that does the processing and sends any messages needed. I'm currently working on an easy way to allow functions to save state. 

The main thing coming soon is subscriptions: a feature that allows you to subscribe to notifications on different events, like sporting events, tv shows, news keywords, twitter hashtags, etc. 

To set this up, you'll need to make a login.js file in the topmost level of this project that contains: 

module.exports = {
	email: "bot's facebook email"
	password: "bot's facebook password",
	hmsspacekey: "api key for hms.space (a url archiving/shortening service this bot uses)",
	creatoremail: "not used"
};


Commands:

@name lastname : works like a mention. Messages the person and lets them know they were mentioned (and tells them the text of the message they were mentioned in). Can be used as part of a sentence, and you can do multiple mentions in a single message. You can only mention people in the current group chat.

/markov firstname lastname : Trains a markov chain on this persons recent messages, and then outputs generated text. 

Links must be posted in their own message, for now, but any link posted appropriately will be automatically archived and shortened.

/test : posts a stupid message.  




The MIT License (MIT)

Copyright (c) 2015 Avery, Benjamin, David, Maude

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

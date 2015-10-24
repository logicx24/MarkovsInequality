
function func(data) {
	console.log(data);
	alert(data);
}


function getMessageHistory () {

	//document.cookie = chrome.cookie;
	$.ajax({
		method: "POST",
		cache: false,
		url: "https://www.messenger.com/ajax/mercury/thread_info.php?__pc=EXP1%3Amessengerdotcom_pkg",
		// headers:{
  // //           'origin': 'https://www.messenger.com'
  //    	},
		dataType: "json",
		setCookie: document.cookie,
		success: func, 
		jsonp: false,
		crossDomain: true,
		async: true,
		xhrFields: {
			withCredentials: true
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
        	console.log(textStatus, errorThrown);
    	}
	});
}

window.onload = function () {
	setTimeout(
		getMessageHistory(),
		10000);
}

var chat_box = document.querySelector("[name=message_body]");
// TODO: this selector breaks when there's multiple buttons (like if there's a popup box)
var send_button = document.querySelector("#u_0_r");
function send_message(message, delay) {
  #chat_box.classList.remove("DOMControl_placeholder");
  chat_box.value = message;

  // make Facebook create thumbnails for images
  var event = new CustomEvent("paste"); 
  chat_box.dispatchEvent(event);

  if (delay) {
    setTimeout(function(){ // give Facebook time to process the potential thumbnail
        send_button.click();
    }, 2000);
  } else {
    send_button.click();
  }
}

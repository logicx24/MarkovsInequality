
function func(data) {
	console.log(data);
	alert(data);
}


function getMessageHistory () {

	//document.cookie = chrome.cookie;

	var talk = 807942749260663;
	var offset = 0;
	var limit = 25;
	var headers = {
		"origin": "https://www.facebook.com", 
		"accept-encoding": "gzip,deflate", 
		"accept-language": "en-US,en;q=0.8", 
		"cookie": "your_cookie_value", 
		"pragma": "no-cache", 
		"user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.122 Safari/537.36", 
		"content-type": "application/x-www-form-urlencoded", 
		"accept": "*/*", 
		"cache-control": "no-cache", 
		"referer": "https://www.facebook.com/messages/zuck"
	};
	var key1 = "messages[thread_fbids][" + talk.toString() + "][offset]";
	var key2 = "messages[thread_fbids][" + talk.toString() + "][limit]";
	var data = {
		key1 : offset.toString(), 
		key2 : limit.toString(),
		"client": "web_messenger", 
		"__user": "your_user_id", 
		"__a": "1", 
		"__dyn": "your __dyn", 
		"__req": "your __req", 
		"fb_dtsg": "your_fb_dtsg", 
		"ttstamp": "your_ttstamp", 
		"__rev": "your __rev"
	};


	$.ajax({
		method: "POST",
		cache: false,
		url: "https://www.facebook.com/ajax/mercury/thread_info.php",
		headers: headers,
		dataType: "json",
		data: data,
		setCookie: document.cookie,
		success: func, 
		jsonp: false,
		crossDomain: true,
		async: true,
		xhrFields: {
			withCredentials: true,
			crossDomain: true
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

// var chat_box = document.querySelector("[name=message_body]");
// // TODO: this selector breaks when there's multiple buttons (like if there's a popup box)
// var send_button = document.querySelector("#u_0_r");
// function send_message(message, delay) {
//   //chat_box.classList.remove("DOMControl_placeholder");
//   chat_box.value = message;

//   // make Facebook create thumbnails for images
//   var event = new CustomEvent("paste"); 
//   chat_box.dispatchEvent(event);

//   if (delay) {
//     setTimeout(function(){ // give Facebook time to process the potential thumbnail
//         send_button.click();
//     }, 2000);
//   } else {
//     send_button.click();
//   }
// }

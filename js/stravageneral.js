$.urlParam = function(name){
	try {
		var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
		return results[1] || 0;
	}catch(err){
		return 1;
	}
}

var code = $.urlParam('code');
var auth_code = 0;

function auth(){
	$.ajax({
		url: "php/form.php?code="+code,
		dataType: 'json',
		type: 'POST',
		//data: {code:code},
		success: function(data){
			//console.log(data);
			auth_code=data.access_token;
			loadPage();
		},
		error: function(xhr,textStatus,errorThrown){
			console.log("error");
		}
	});

}

function secondsToHms(d) {
	d = Number(d);
	var h = Math.floor(d / 3600);
	var m = Math.floor(d % 3600 / 60);
	var s = Math.floor(d % 3600 % 60);
	return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s); 
}

function ajaxCall(func, url){
	$.ajax({
		url: url,
		dataType: 'jsonp',
		success: function(data){
			console.log(data);
			func(data);
		},
		error: function(xhr,textStatus,errorThrown){
			console.log("error");
		}
	});

}

$(document).ready(function(){
	if(code == 1){
		$('.name').html("Error!");
		$('.info').html("You need to authenticate with Strava first, click below to go to the home page<br> <a class='btn btn-lg btn-danger' href='stravalaunch.html'>Home</a>");
	} else {
		$('#homelink').html('<a href="home.html?state=&code='+code+'">Home</a>');
		//$('#clublink').html('<a href="club.html?state=&code='+code+'">Club</a>');
		$('#traininglink').html('<a href="training.html?state=&code='+code+'">RAB 2017</a>');
		$('#aboutlink').html('<a href="about.html?state=&code='+code+'">About</a>');
	}
});


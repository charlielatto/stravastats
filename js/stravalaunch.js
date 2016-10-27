var clientid = 14160;
var redirect = "http://31.49.89.14/stravastats/home.html";
var url = "https://www.strava.com/oauth/authorize?client_id="+clientid+"&response_type=code&redirect_uri="+redirect;

function callStrava(){
	location.href = url;
}

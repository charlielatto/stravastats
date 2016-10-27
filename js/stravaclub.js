var satStart,satEnd;

$.urlParam = function(name){
	try{
		var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
		return results[1] || 0;
	}catch(err){
		return 1;
	}
}
var clubid = $.urlParam('club');


function clubData(data){
	var name = data.name;
	var desc = "";
	if (data.description.startsWith("http") || data.description.startsWith("www")){
		desc = "<a href='" + data.description +"'>"+data.description+"</a>";
	} else {
		desc = data.description;
	}
	
	if (data.city !== ""){
		var info = data.city +", " + data.country + "<br>"+desc+"<br>Strava Member Count: <span class='result'>"+data.member_count+"</span>";
	} else {
		var info = data.country + "<br>"+ desc +"<br>Strava Member Count: <span class='result'>"+data.member_count+"</span>";

	}
	$('.name').html(name);
	$('.info').html(info);
	$('#pic').html('<img class="profilepic" src="'+data.profile+'" alt="profile pic">');
}

function clubStats(data){
	var ssrs = [];
	for(var i =0; i<data.length;i++){
		if(data[i].name.includes("IBC") || data[i].name.includes("SSR")){
			ssrs.push(data[i]);
		}
	}
	console.log(ssrs);
	
}

function getRidesLastSaturday(){
	$.ajax({
		url: "https://www.strava.com/api/v3/clubs/19935/activities?per_page=200&access_token="+auth_code,
		dataType: 'jsonp',
		success: function(data){
			console.log(data);
			clubStats(data);
		},
		error: function(xhr,textStatus,errorThrown){
			console.log("error");
		}
	});
}

function saturday(){
		var now = new Date();
		satStart = new Date();
		satEnd = new Date();
		if (now.getDay() != 6){
			satStart.setDate(now.getDate()-(now.getDay()+1));
			satEnd.setDate(now.getDate()-(now.getDay()+1));
		} 
		satStart.setHours(7);
		satStart.setMinutes(0);
		satEnd.setHours(10);
		satEnd.setMinutes(15);
		console.log(satStart + " " + satEnd);
}





function loadPage(){
	ajaxCall(clubData,"https://www.strava.com/api/v3/clubs/"+clubid+"?access_token="+auth_code);
	//saturday();
	//getRidesLastSaturday();
}


$(document).ready(function(){
	if(code != 1){
		auth();
	} 
});
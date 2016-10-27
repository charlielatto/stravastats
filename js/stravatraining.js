var clubid = 231088;
var yearPeriod = 0;
var daysToGo = 0;
var nineDays = [];
var motivation = ["Good Luck!", "Too late to train now.... rest up and good luck!", "You better be training hard!", "Better start training!", "Get those winter miles in!"];
var nineDayData = [];
var riderid;
var selectedDate = new Date();

function RABData(data){
	$('#pic2').html('<img class="profilepic" src="'+data.profile+'" alt="profile pic">');
	$('.countdown').html("<strong class='result2'>"+daysToGo+ " Days</strong> to go until the start of RAB 2017!");
	$('.countdown').append("<br><span>("+motivation[yearPeriod]+")</span>");
}

function userData(data){
	$('.user').html(data.firstname + " " + data.lastname);
}

function loadPage(){
	ajaxCall(RABData,"https://www.strava.com/api/v3/clubs/"+clubid+"?access_token="+auth_code);
	//getNineDayData();
	getNineDayDataSingleQuery();
	ajaxCall(userData, "https://www.strava.com/api/v3/athlete?access_token="+auth_code)
}

function getNineDayDataSingleQuery(){
	var lastdate = new Date(selectedDate);
	lastdate.setHours(24,0,0,0);
	lastdate = lastdate/1000;
	var startdate = nineDays[0]/1000;
	ajaxCall(nineDayQuery,"https://www.strava.com/api/v3/activities?after="+startdate+"&before="+lastdate+"&per_page=60&access_token="+auth_code)
}

function nineDayQuery(data){
	nineDayData = [];
	for(var i = 0; i < 9; i++){
		dayArray = []
		var date = new Date(nineDays[i]);
		for(var j = 0; j < data.length;j++){
			var tempdate = new Date(data[j].start_date_local);
			tempdate.setHours(0,0,0,0);
			if(tempdate.getTime() === date.getTime()){
				dayArray.push(data[j]);
			}
		}
		nineDayData.push(dayArray);
	}
	//console.log(nineDayData);
	processData();
}

function processData(){
	var dist = 0;
	var elev = 0;
	var time = 0;
	var avg_speed = 0;
	var consec_days = 0;
	var total_consec_days = 0;
	var rides = 0;
	var longest = 0;
	for (var i = 0; i < nineDayData.length; i++) {
		var daydistance = 0;
		var dayelev = 0;
		var daytime = 0;
		if (nineDayData[i].length > 0){
			consec_days++;
			if (consec_days > total_consec_days){
				total_consec_days = consec_days;
			}
		} else {
			consec_days = 0;
		}
		for (var j = 0; j <nineDayData[i].length; j++){
			rides++;
			if (nineDayData[i][j].distance > longest){
				longest = nineDayData[i][j].distance;
			}
			daydistance = daydistance + nineDayData[i][j].distance;
			dayelev = dayelev + nineDayData[i][j].total_elevation_gain;
			daytime = daytime + nineDayData[i][j].moving_time;
			avg_speed = avg_speed + nineDayData[i][j].average_speed;
		}
		dist = dist + daydistance;
		elev = elev + dayelev;
		time = time + daytime;
	}
	avg_speed = avg_speed/rides;
	var mph = ((getMiles(avg_speed)*60)*60).toFixed(2);
	var total_time = secondsToHms(time);
	var miles = getMiles(dist).toFixed(2);
	var milesper = (miles/969)*100;
	var estimatedTime = ((969/mph)*60)*60;
	var longestMiles = getMiles(longest).toFixed(2);
	$('.rideCount').html(rides);
	$('.dist-progress-bar').css('width', milesper+'%').attr('aria-valuenow', miles); 
	$('.dist-progressamount').html(miles + " miles");
	
	$('.elev-progress-bar').css('width', ((elev/12641)*100)+'%').attr('aria-valuenow', elev); 
	$('.elev-progressamount').html(elev + "m");
	
	$('.days-progress-bar').css('width', ((total_consec_days/9)*100)+'%').attr('aria-valuenow', total_consec_days); 
	$('.days-progressamount').html(total_consec_days);
	
	$('.avgspeed').html(mph+ "mph and estimated total time of "+secondsToHms(estimatedTime));
	$('.time-progress-bar').css('width', ((time/estimatedTime)*100)+'%').attr('aria-valuenow', time); 
	$('.time-progressamount').html(total_time);
	
	$('.long-progress-bar').css('width', ((longestMiles/126)*100)+'%').attr('aria-valuenow', longestMiles); 
	$('.long-progressamount').html(longestMiles + " miles");
	//console.log(miles + " " + elev +" " + mph + " " + total_time + " " + total_consec_days);
}

function getMiles(i) {
     return i*0.000621371192;
}

function dateCount(){
	var now = new Date();
	now.setHours(0,0,0,0);
	var startDate = new Date("09/09/2017");
	startDate.setHours(0,0,0,0);
	daysToGo = daydiff(now,startDate);
	
}

function daydiff(first, second) {
    return Math.round((second-first)/(1000*60*60*24));
}

function get9Days(){
	nineDays = [];
	for(var i = 8; i >= 0; i--){
		var tempdate = new Date(selectedDate);
		tempdate.setDate(tempdate.getDate()-i);
		tempdate.setHours(0,0,0,0);
		nineDays.push(tempdate);
	}
	$('.rideDate').html(formatDate(selectedDate));
	//console.log(nineDays);
}

function period(){
	if (daysToGo > 180) {
		yearPeriod = 4;
	} else if (daysToGo > 90) {
		yearPeriod = 3;
	} else if (daysToGo > 9) {
		yearPeriod = 2;
	} else if (daysToGo > 1) {
		yearPeriod = 1;
	} else {
		yearPeriod = 0;
	}
}

function formatDate(date){
	return selectedDate.getDate() + "/" + (selectedDate.getMonth()+1) + "/" + selectedDate.getFullYear();
}

$(document).ready(function(){
	if(code != 1){
		//console.log(selectedDate);
		var maxDate = new Date();
		$('#datetimepicker1').datetimepicker({maxDate: maxDate,defaultDate: selectedDate,format: 'MM/DD/YYYY'});
		$('#datetimepicker1').on('dp.change', function (ev) {
			var date = $('#datetimepicker1').data('date')
			
			selectedDate = new Date(date);
			
			get9Days();
			//getNineDayData();
			getNineDayDataSingleQuery();
			//console.log(selectedDate);
		});
		get9Days();
		dateCount();
		period();
		auth();
	} 	
});


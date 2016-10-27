var riderid = 0;
var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var months = [];
var years = [];
var weekdays = ["Mon","Tue","Wed","Thu","Fri","Sat", "Sun"];
var auth_code;
var graphData = JSON.parse(JSON.stringify(graphsJSON));
var monthData = [];


//console.log(code);



function profileData(data){
	var name = data.firstname + " " + data.lastname;
	var info = data.city +", " + data.country;
	if (data.clubs.length > 0){
		info = info + "<br>Clubs: ";
		for (var i=0;i<data.clubs.length;i++){
			if (i == data.clubs.length-1) {
				info = info + "<a href=club.html?state=&code="+code+"&club="+data.clubs[i].id+">"+data.clubs[i].name+"</a>";
			} else {
				info = info + "<a href=club.html?state=&code="+code+"&club="+data.clubs[i].id+">"+data.clubs[i].name+"</a>" + ", "; 
			}
		}
	}
	$('.name').html(name);
	$('.info').html(info);
	$('#pic').html('<img class="profilepic" src="'+data.profile+'" alt="profile pic">');
	riderid = data.id;
	ajaxCall(achievements, "https://www.strava.com/api/v3/athletes/"+riderid+"/stats?access_token="+auth_code);
}
			
function achievements(data){
	$('.achieve').html("Total Number of Rides: <span class='result'>" + data.all_ride_totals.count 
		+ "</span><br>Total Distance: <span class='result'>"+ Math.round(data.all_ride_totals.distance/1000) 
		+"km</span><br>Longest Distance: <span class='result'>"+ Math.round(data.biggest_ride_distance/1000)+"km</span>");
}

function secondsToHms(d) {
	d = Number(d);
	var h = Math.floor(d / 3600);
	var m = Math.floor(d % 3600 / 60);
	var s = Math.floor(d % 3600 % 60);
	return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s); 
}

function twelveMonthData(){
	var rideDistanceData = [];
	var timeSpeedData = [];
	var dayRides = [0,0,0,0,0,0,0];
	var noncommutes = 0;
	var weekData = [];
	for (var i =0;i<monthData.length;i++){
		var dist = 0;
		var time = 0;
		var speedtotal = 0
		for (var j =0; j < monthData[i].length; j++){
			dist = dist + monthData[i][j].distance;
			time = time + monthData[i][j].moving_time;
			speedtotal = speedtotal + monthData[i][j].average_speed;
			if(!monthData[i][j].commute){
				var starttime = new Date(monthData[i][j].start_date);
				var weekday;
				if(starttime.getDay() == 0){
					weekday = 6
				} else {
					weekday = starttime.getDay() - 1;
				}
				dayRides[weekday]++;
				noncommutes++;
			}
		}
		//var avgspeed = Math.round((((speedtotal/monthData[i].length)*60)*60)/1000);
		var avgspeed = ((((speedtotal/monthData[i].length)*60)*60)/1000).toFixed(2);
		var stringTime = secondsToHms(time);
		dist = Math.round(dist/1000);
		
		var rdobj = {month:months[i], count:monthData[i].length, distance:dist};
		rideDistanceData.push(rdobj);
		var tsobj = {month:months[i], time:time, speed:avgspeed, stringtime:stringTime};
		timeSpeedData.push(tsobj);
		
		
		
		//$('.results').append(months[i] + ": " + counts[i]+"<br>");
	}
	for(var j=0;j<dayRides.length;j++){
		var rideper = ((dayRides[j]/noncommutes)*100).toFixed(1);
		weekData.push({day:weekdays[j],rides:rideper});
	}
	//console.log(dayRides.length);
	weekChart(weekData,graphData[3]);
	
	//console.log(data);
	rideDistanceGraphFunc(rideDistanceData,graphData[0]);
	timeSpeedGraphFunc(timeSpeedData,graphData[1]);
	//console.log(timeSpeedData);
}

function rideDistanceGraphFunc(data,graphData){
	graphData.dataProvider = data;
	graphData.valueAxes[0].title= "Rides";
	graphData.valueAxes[1].title= "Distance (km)";
	graphData.graphs[0].valueField = "count";
	graphData.graphs[0].balloonText = "[[category]]<br><b><span style='font-size:14px;'>[[count]]</span></b>";
	graphData.graphs[1].valueField = "distance";
	graphData.graphs[1].balloonText = "[[category]]<br><b><span style='font-size:14px;'>[[distance]]km</span></b>";
	var chart = AmCharts.makeChart("chartdiv",graphData);
}

function timeSpeedGraphFunc(data,graphData){
	graphData.dataProvider = data;
	graphData.valueAxes[0].title= "Time";
	graphData.valueAxes[1].title= "Avg Speed (kph)";
	graphData.graphs[0].valueField = "time";
	graphData.graphs[0].balloonText = "[[category]]<br><b><span style='font-size:14px;'>[[stringtime]]</span></b>";
	graphData.graphs[1].valueField = "speed";
	graphData.graphs[1].balloonText = "[[category]]<br><b><span style='font-size:14px;'>[[speed]]kph</span></b>";
	var chart = AmCharts.makeChart("chartdiv2",graphData);
}

function monthSelector(){
	var e = $('.monthSelector option:selected').val();
	var monthindex = e;
	lastMonthData(monthindex);
}

function lastMonthData(index){
//	function lastMonthData(monthData, index){
	//var index = 10;
	$('.monthDesc').html(" " + months[index] + " " + years[index]);
	var rideTypes = [];
	var lastMonth = monthData[index];
	var commutes = 0;
	var rides = 0;
	var tableData = [0,0,0,0,0,0]
	for (var i =0;i<lastMonth.length;i++){
		if(lastMonth[i].commute){
			commutes++;
		} else {
			rides++;
			//console.log(weekday + " " + weekdays[weekday] +" " + lastMonth[i].start_date);
		}
		tableData[0]++;
		tableData[1] = tableData[1] + lastMonth[i].average_speed;
		tableData[2] = tableData[2] + lastMonth[i].distance;
		tableData[3] = tableData[3] + lastMonth[i].total_elevation_gain;
		if(typeof lastMonth[i].kilojoules !== 'undefined') {
			tableData[4] = tableData[4] + lastMonth[i].kilojoules;
		}
		tableData[5] = tableData[5] + lastMonth[i].moving_time;
	}
	tableData[1] = ((((tableData[1]/lastMonth.length)*60)*60)/1000).toFixed(2);
	
	$('.tablerides').html(tableData[0]);
	$('.tablespeed').html(tableData[1]);
	$('.tabledist').html(Math.round(tableData[2]/1000));
	$('.tableelev').html(tableData[3]);
	$('.tablecal').html(Math.round(tableData[4]));
	$('.tabletime').html(secondsToHms(tableData[5]));
	rideTypes.push({type:"Commutes",total:commutes});
	rideTypes.push({type:"Rides",total:rides});
	//console.log(weekData);
	commutePie(rideTypes,graphData[2]);
}

function commutePie(data,graphData){
	graphData.dataProvider = data;
	jQuery(".nav-tabs a").on("shown.bs.tab", function() {
		var data = jQuery(this).data();
		if (data.chart !== undefined) {
			chart.validateSize();
		}
	});
	var chart = AmCharts.makeChart("monthChartDiv",graphData);
}

function weekChart(data,graphData){
	graphData.dataProvider = data;
	graphData.valueAxes[0].title= "Rides (%)";
	graphData.graphs[0].valueField = "rides";
	graphData.graphs[0].balloonText = "[[category]]<br><b><span style='font-size:14px;'>[[rides]]%</span></b>";
	var chart = AmCharts.makeChart("chartDiv3",graphData);
}

function getMonthIndex(index) {
	var month = months[index];
	return monthNames.indexOf(month);
}

function getRidesPerMonth(){
	var responses = [];
	//var monthData = [];
	$.each(months, function(index,mon){
		var now = new Date();
		var month = getMonthIndex(index);
		var startOfMonth = new Date(years[index],month,1)/1000;
		var endOfMonth = new Date(years[index],month+1,1)/1000;
		//console.log(new Date(years[index],month,1) + " " + new Date(years[index],month+1,1));
		responses.push(
			$.ajax({
				url: "https://www.strava.com/api/v3/activities?after="+startOfMonth+"&before="+endOfMonth+"&per_page=60&access_token="+auth_code,
				dataType: "jsonp",
				type: "GET"
			})
		);
	});
	
	$.when.apply($, responses).then(function(){
		//console.log(responses[0].responseJSON.length);
		for (var i = 0; i<responses.length;i++){
			monthData.push(responses[i].responseJSON);
		}
		twelveMonthData();
		lastMonthData(11);
	}).fail(function(){
		console.log("iterate error")
	});
}

function getMonths(){
	var now = new Date();
	var currentMonth = now.getMonth();
	for (var i = 0; i<=currentMonth;i++){
		months[i] = monthNames[i];
	}
}

function get12Months(){
	var now = new Date();
	var year = now.getFullYear();
	var currentMonth = now.getMonth();
	var index = 11;
	months[index] = monthNames[currentMonth];
	years[index] = year; 
	while(index > 0) {
		currentMonth--;
		if(currentMonth == -1){
			currentMonth = 11;
			year = year - 1;
		}
		index--;
		months[index] = monthNames[currentMonth];
		years[index] = year; 
	}
	
	for (var i = 0; i < months.length-1; i++){
		$('.monthSelector').append("<option value='"+i+"'>"+months[i]+" "+years[i]+"</option>");
	}
	
	$('.monthSelector').append("<option value='11' selected='selected'>"+months[11]+" "+years[11]+"</option>");
	//console.log(months + " " + years);
}	

function loadPage(){
	ajaxCall(profileData,"https://www.strava.com/api/v3/athlete?access_token="+auth_code);
	getRidesPerMonth();
}	
			
$(document).ready(function(){
	if(code != 1){
		get12Months();
		auth();
	} 
});

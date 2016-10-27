<?php
	
	//$code = $argv[1];
	$code = $_GET["code"];

	$target_url = 'https://www.strava.com/oauth/token?client_id=14160&client_secret=9418bbb1abcaffb68263aabd51a2c732e4d82564&code='.$code;
 
   	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL,$target_url);
	curl_setopt($ch, CURLOPT_POST,1);
    	curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
	$result=curl_exec ($ch);
	curl_close ($ch);
	echo $result;
?>

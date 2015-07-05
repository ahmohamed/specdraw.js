var ajax = function (url, callback, err) {
	var http_request = new XMLHttpRequest();
	http_request.open("GET", url, true);
	http_request.onreadystatechange = function () {
	  var done = 4;
	  var ok = 200;
	  if (http_request.readyState === done && http_request.status === ok){
			if(typeof(callback) === 'function')
				callback(http_request.responseText);
		}else	if (http_request.readyState === done){
			err(http_request.responseText)
		}
	};
	http_request.send();	
};
var ajaxJSONGet = function(url, callback, show_progress){
	var prog = ajaxProgress();
	ajax(url, function (response) {
		prog.stop();
		var json = JSON.parse(response);
		if(typeof json['error'] === 'undefined'){
		  callback(json);
		}else{
			modals.error(json['error']['name'], json['error']['message']);
		}

	},
	function (err) {
		prog.stop();
		modals.error('Network Error', err);
	});
	
	if(show_progress)
		prog();
};

var ajaxProgress = function () {
	var interval, stopped=false;
	function check () {
		ajax('/nmr/test', function (response) {
			if(!stopped){
				d3.select(".progress").text(response);
				setTimeout(check, 100);
			}else{
				ajax('/nmr/test?complete=1')
			}
		});
	}
	
	var run = function() {
		check();
	}
	
	run.stop = function() {
		clearInterval(interval);
		stopped = true;
	  d3.select(".progress").text("Completed")
			/*.transition()
	    .duration(2500)
	    .style("opacity", 1e-6)*/
	}
	return run;
}

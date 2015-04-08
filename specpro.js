(function(){ "use strict";
var pro = {};
var ajax = function (url, callback) {
	var http_request = new XMLHttpRequest();
	http_request.open("GET", url, true);
	http_request.onreadystatechange = function () {
	  var done = 4;
	  var ok = 200;
	  if (http_request.readyState === done && http_request.status === ok){
			if(typeof(callback) === 'function')
				callback(http_request.responseText);
		}
	};
	http_request.send();	
};
var ajaxJSONGet = function(url, callback){
	var prog = ajaxProgress();
	ajax(url, function (response) {
		prog.stop();
	  callback(JSON.parse(response));
	});
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

var get_png_data = function(y, callback){
	var img = new Image();
	
	img.onload = function(){
	    console.log(img.width, img.height);
	    var canvas = document.createElement("canvas");
	    canvas.width = img.width;
	    canvas.height = img.height;

	    // Copy the image contents to the canvas
	    var ctx = canvas.getContext("2d");

	    ctx.drawImage(img, 0, 0);    
	    var buffer = ctx.getImageData(0,0,img.width,img.height).data;
		
	    var img_data = Array.prototype.filter.call(buffer, function(element, index){
	        return(index%4==0);
	    });
		
		callback(img_data)
	}
	
	img.src = "data:image/ png;base64," + y;	
};

var process_xy = function(pre_data, render_fun){
	var data = pre_data.x.map(function(d,i){ return {x:d, y:pre_data.y[i]}; });	
	render_fun(data);
};

var process_png = function(pre_data, render_fun){
	if (pre_data['nd'] == 1){
		get_png_data(pre_data['y'], function(img_data){
			// Scaling X and Y
			var xscale = d3.scale.linear().range(pre_data['x_domain']).domain([0, img_data.length]);
			var yscale = d3.scale.linear().range(pre_data['y_domain']).domain([0, 255]);
		
			// Mapping data and rendering
			var data = img_data.map(function(d,i){ return {x:xscale(i), y:yscale(d)}; });
			render_fun(data);	
		});
	}
	
	if (pre_data['nd'] == 2){
		// Mapping data and rendering
		render_fun(pre_data);
	}
};


var process_b64 = function(pre_data, render_fun){
	var img_data = atob(pre_data['y'])
	console.log(img_data);
	// Scaling X and Y
	var xscale = d3.scale.linear().range(pre_data['x_domain']).domain([0, img_data.length]);
	var yscale = d3.scale.linear().range(pre_data['y_domain']).domain([0, 255]);

	// Mapping data and rendering
	var data = img_data.map(function(d,i){ return {x:xscale(i), y:yscale(d)}; });
	render_fun(data);	
};


/* * get the sepctrum from the web service in one these formats:
	* Plain JSON X-Y ['xy']
	* JSON X(range), Y (base64) ['base64'] --> if scaled down to 8 or 16 bits: require "y_domain"
	* JSON X(range), Y(png) ['png']--> require "y_domain"

   * JSON object will contain the following parameters:
	* format: xy, base64, png
	* nd: number of dimensions (1 or 2)
	* x or x_domain: the chemical shift (x) value for each point, or chemical shift range (x_doamin)
	* y: singal intensities along the sepctrum.
	* y_domain: if 'y' was reduced to 8 or 16 bit, y_domain scales it back to original values.
*/
pro.get_spec = function(url, render_fun){
	ajaxJSONGet(url, function(pre_data){
		switch (pre_data['format']){
			case 'xy':
				process_xy(pre_data, render_fun);
				break;
			case 'base64'://add base64 processing
				process_b64(pre_data, render_fun)
				break;
			case 'png':
				process_png(pre_data, render_fun);
				break;
		}
	});	
}

var proc_spec = function (param, callback) {
	var url = '/nmr/spec_pro/'+param;
	console.log(url);
	ajaxJSONGet(url, callback);
};
pro.pp = function (alg, threshold, seg) {
	var a;
	
	if(!alg || alg=="threshold")
		a = 't';
	else if(alg=="connected")
		a = 'c'
	else if(alg=="cwt")
		a = 'cwt'
	
	if(!threshold)
		threshold = 0;
	proc_spec('pp?pp_a='+a
		+ '&pp_t='+threshold
		+ '&pp_s='+(seg? 1 : 0), 
		function (json) {
			d3.select(".main-focus").node().addPeaks(json['peaks']);
			if(seg) d3.select(".spec-line").node().addSegmentByIndex(json['segs']);
		});
}
pro.bl = function (alg, params) {
	var param_str = '';
	for(key in params){
		params_str += '&bl_'+key+'='+params[key];
	}
	
	proc_spec('bl?bl_a='+alg + param_str+"&bl_prev=1", 
		function (json) {
			var yscale = d3.scale.linear().range(json['y_domain']).domain([0, 255]);
			//var focus_xscale = d3.select(".main-focus").node().range.x;
			
			get_png_data(json['data'],function (img_data) {
				//var xscale = d3.scale.linear().range(focus_xscale).domain([0, img_data.length]);
				var data = img_data.map(function(d,i){ return yscale(d); });
				
				d3.select(".main-focus").node().addSpecLine(data, false);
			});
			
			
		});
}
window.pro = pro;
console.log("specpro");

})();
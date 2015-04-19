(function(){ "use strict";
var pro = {};
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
var ajaxJSONGet = function(url, callback){
	var prog = ajaxProgress();
	ajax(url, function (response) {
		prog.stop();
	  callback(JSON.parse(response));
	},
	function (err) {
		prog.stop();
		console.log(err)
	});
	
	//prog();
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
	var img = document.createElement("img");
	
	img.onload = function(){
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
	
	img.src = "data:image/png;base64," + y;	
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
pro.bl = function (callback, params) {
	var params_str = '';
	for(var key in params){
		if(params_str.length>0) params_str +='&';
			
		params_str += 'bl_'+key+'='+params[key];
	}
	
	proc_spec('bl?'+params_str, 
		function (json) {
			var yscale = d3.scale.linear().range(json['y_domain']).domain([0, 255]);
			
			get_png_data(json['data'],function (img_data) {
				var data = [];
				
				if(json['bits'] == 16){
					var len =  img_data.length/2;
					yscale.domain([0,Math.pow(2,16)-1]);
					
					for (var i = 0; i < len; i++) {						
						data[i] = yscale( (img_data[ i + len ] << 8) + img_data[i]);
						//if(i<100)console.log(data[i], (img_data[ i + len ] << 8) + img_data[i])
					}
				}else{					
					data = img_data.map(function(d,i){ return yscale(d); });
				}
				//console.log(img_data, data)
				callback(data);
			});			
		});
}
window.pro = pro;
console.log("specpro");

})();
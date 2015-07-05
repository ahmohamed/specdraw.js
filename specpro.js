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
var ajaxJSONGet = function(url, callback, show_progress){
	var prog = ajaxProgress();
	ajax(url, function (response) {
		prog.stop();
	  callback(JSON.parse(response));
	},
	function (err) {
		prog.stop();
		console.log(err)
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


var processPNG = function (json, callback) {
	if (!json['nd'] || json['nd'] == 1){
		var img = document.createElement("img");
	
		img.onload = function(){
	    var canvas = document.createElement("canvas");
	    canvas.width = img.width;
	    canvas.height = img.height;

	    // Copy the image contents to the canvas
	    var ctx = canvas.getContext("2d");

	    ctx.drawImage(img, 0, 0);    
	    var buffer = ctx.getImageData(0,0,img.width,img.height).data;
	
	    var img_data = [];
			var _16bit = (json['format'] == "png16")
			var len = _16bit? buffer.length/2: buffer.length;
			
			var yscale = d3.scale.linear().range(json['y_domain']).domain([0, 255]);
			if(_16bit) yscale.domain([0,Math.pow(2,16)-1]);
			
			for (var i = 0; i < len; i+=4) {
				if(!_16bit){
					img_data.push(yscale(buffer[i]))
				}else{
					img_data.push( yscale( (buffer[ i + len ] << 8) + buffer[i]) );
				}
			}
			
			if(json['x_domain']){
				var xscale = d3.scale.linear().range(json['x_domain']).domain([0, img_data.length]);
				img_data = img_data.map(function(d,i){ return {x:xscale(i), y:d}; });
			}
			
			console.log("img_data",img_data);
			var ret;
			if(typeof json["s_id"] != 'undefined')
				ret = {data:img_data, s_id:json['s_id']}
			else{ ret = {data:img_data} }
			
			callback(ret)
		}
		var png_data = json['data']? json['data']: json['y'];
		img.src = "data:image/png;base64," + png_data;
	}else if (json['nd'] == 2){
		// Mapping data and rendering
		callback(json);
	}else{
		console.log("Unsupported data dimension: "+ json['nd'])
	}
};

/* * get the sepctrum from the web service in one these formats:
	* Plain JSON X-Y ['xy']
	* JSON X(range), Y (base64) ['base64'] --> if scaled down to 8 or 16 bits: require "y_domain"
	* JSON X(range), Y(png) ['png']--> require "y_domain"

  ** JSON object will contain the following parameters:
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
};

pro.get_spectrum = function (url, render_fun) {
	ajaxJSONGet(url, function (response) {
		processPNG(response, render_fun);
	});
};
var find_menu_item = function (menu, item) {
	for (var i = menu.length - 1; i >= 0; i--) {
		if(menu[i].label == item){
			return menu[i];
		}
	}
	menu.push({label:item})
	//console.log(menu, item)
	return menu[menu.length-1];
};

var append_menu_item = function(menu, item){
	if ("fun" in item) {
		if("args" in item && item["args"]){
			menu["fun"] = spec.method_args(item["fun"] ,item["args"], item["title"])
		}else{
			menu["fun"] = function () {pro.plugin_funcs (item["fun"])	};			
		}
		return;
	}
	
	if(!menu.children)
		menu.children = [];
			
	for (var k in item) {
		var sub_menu = find_menu_item(menu.children, k);
		append_menu_item(sub_menu, item[k]);
	}
};

pro.read_menu = function (menu, callback) {
	ajaxJSONGet('/nmr/test', function (response) {
		for (var k in response) {
			var sub_menu = find_menu_item(menu, k);
			append_menu_item(sub_menu, response[k]);
		}
		callback(menu);
	});
};
//pro.read_menu();
pro.output = {};
pro.output.overwriteSpec = function (new_data, s_id) {
	if(typeof s_id === 'undefined' && 
		typeof new_data['s_id'] !== 'undefined'){
		s_id = new_data['s_id'];
	}
	
	var _main_focus = d3.select(".main-focus");
	var classname = _main_focus.node().nd == 1 ? ".spec-line" : ".spec-img";
	var overwrite_spec = _main_focus.selectAll(classname)
	.filter(function(e){ return this.s_id()==s_id; });
	
	_main_focus.node().addSpecLine(new_data, true, overwrite_spec);
};
pro.output.preview = function (new_data) {
	if(d3.select(".preview-spec").size() > 0){
		d3.select(".preview-spec").node().setData(new_data);
	}else{
		d3.select(".main-focus").node()
			.addSpecLine(new_data, false)
			.classed("preview-spec", true);		
	}
};
pro.output.newSpec = function (new_data) {
	d3.select(".main-focus").node().addSpecLine(new_data);
};
pro.output.newSlide = function (new_data) {
	
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


var get_selected_spec = function () {
	var _main_focus = d3.select(".main-focus");
	var classname = _main_focus.node().nd == 1 ? ".spec-line" : ".spec-img"
	
	var s_id = _main_focus.selectAll(classname+".selected")[0].map(function(d){return d.s_id();});
	if(s_id.length == 0)
		s_id = _main_focus.selectAll(classname)[0].map(function(d){return d.s_id();});
	
	return s_id;
};

pro.plugin_funcs = function (fun, params, s_id) {
	if(!s_id) s_id = get_selected_spec();
	
	var params_str = "sid="+s_id+"&" + fun+'_=null';
	for(var key in params){
		if(params_str.length>0) params_str +='&';			
		params_str += fun+'_'+key+'='+params[key];
	}
	
	var url = '/nmr/plugins?'+params_str;
	ajaxJSONGet(url, function (response) {
		var output_fun = response["output"]? pro.output[ response["output"] ]: pro.output.overwriteSpec;
		
		processPNG(response, output_fun);
	});
};window.pro = pro;
console.log("specpro");

})();

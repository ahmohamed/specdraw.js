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
	var _main_focus = d3.select(".spec-slide.active").select(".main-focus");
	var classname = _main_focus.node().nd == 1 ? ".spec-line" : ".spec-img"
	
	var s_id = _main_focus.selectAll(classname+".selected")[0].map(function(d){return d.s_id();});
	if(s_id.length == 0)
		s_id = _main_focus.selectAll(classname)[0].map(function(d){return d.s_id();});
	
	return s_id;
};
var plugin_handler = function (json) {
	if (json.constructor === Array) {
		for (var i = json.length - 1; i >= 0; i--) {
			plugin_handler(json[i]);
		}
		return;
	}
	console.log('pass', json)
	if (json['data_type'] === undefined || json['data_type'] === 'spectrum'){
		console.log('is spec', json['data-type'])
		var output_fun = json["output"]? pro.output[ json["output"] ]: pro.output.overwriteSpec;
		pro.process_spectrum(json, output_fun);
		return;
	}
	if (json['peaks'] !== undefined){
		pro.analysis.addPeaks(json);
	}
	if (json['segs'] !== undefined){
		pro.analysis.addSegments(json);
	}
}

pro.plugin_funcs = function (fun, params, s_id) {
	if(!params) params = {};
	
	if(!params['sid']){
		if(s_id){
			params['sid'] = s_id;
		}else{
			params['sid'] = get_selected_spec();
		}
	}
	if(params['sid'].length === 0)
		error('No Spectra selected', 'Please select one or more spectra!');
		
	var prefix = fun+'_';
	var params_str = 'sid=' + JSON.stringify(params['sid']) + '&' + prefix + '=null';
	
	for(var key in params){
		if(key === 'sid') continue;
		if(params_str.length>0) params_str +='&';
		
		params_str += prefix + key+'='+params[key];
	}
	
	var url = '/nmr/plugins?'+params_str;
	ajaxJSONGet(url, function (response) {
			plugin_handler(response);
	});
};
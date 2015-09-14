pro.plugins = function (app) {
	var out = {};
	var get_selected_spec = function () {
		var _main_focus = d3.select(app).select(".spec-slide.active").select(".main-focus");
		var classname = _main_focus.node().nd == 1 ? ".spec-line" : ".spec-img"
	
		var s_id = _main_focus.selectAll(classname+".selected")[0].map(function(d){return d.s_id();});
		if(s_id.length == 0)
			s_id = _main_focus.selectAll(classname)[0].map(function(d){return d.s_id();});
	
		return s_id;
	};
	
	var handle_spectrum = function(json, preview){
		var output_fun = json["output"]? pro.output[ json["output"] ]: pro.output.overwriteSpec;
		pro.process_spectrum(json, output_fun);
		return;
	};

	var handle_spec_feature = function(json, preview){
		if (json['peaks'] !== undefined){
			pro.analysis.addPeaks(json);
		}
		if (json['segs'] !== undefined){
			pro.analysis.addSegments(json);
		}
	};
	
	out.request = function (fun, params, s_id, preview) {
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
		var params_str = 'sid=' + 
			JSON.stringify(params['sid']) + '&preview=' + (+preview) +'&'+ prefix + '=null';
	
		for(var key in params){
			if(key === 'sid') continue;
			if(params_str.length>0) params_str +='&';
		
			params_str += prefix + key+'='+params[key];
		}
	
		var url = '/nmr/plugins?'+params_str;
		ajaxJSONGet(url, function (response) {
				out.response(response, preview);
		});
	};
	
	out.response = function (json, preview) {
		if (json.constructor === Array) {
			for (var i = json.length - 1; i >= 0; i--) {
				out.response(json[i]);
			}
			return;
		}
		if (json['data_type'] === undefined || json['data_type'] === 'spectrum'){
			return handle_spectrum(json, preview);
		}
		if(json['data_type'] === 'spec_feature'){
			handle_spec_feature(json, preview);
			return;
		}
		if(json['data_type'] === 'spec_like'){
			handle_spec_like(json, preview);
			return;
		}
	};	
	return out;
};

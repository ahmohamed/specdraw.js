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

pro.plugin_funcs = function (fun, params, s_id) {
	if(!s_id) s_id = get_selected_spec();
	
	var params_str = "sid=["+s_id+"]&" + fun+'_=null';
	for(var key in params){
		if(params_str.length>0) params_str +='&';			
		params_str += fun+'_'+key+'='+params[key];
	}
	
	var url = '/nmr/plugins?'+params_str;
	ajaxJSONGet(url, function (response) {
		var output_fun = response["output"]? pro.output[ response["output"] ]: pro.output.overwriteSpec;
		
		pro.process_spectrum(response, output_fun);
	});
};
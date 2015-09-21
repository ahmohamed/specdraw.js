module.exports = function (app) {
	function request (fun, params, s_id, preview) {
		params = params || {};
	
		if(!params['sid']){
			if(s_id){
				params['sid'] = s_id;
			}else{
				var sel = app.currentSlide().spectra(true);
				params['sid'] = sel.map(function (s) { return s.s_id(); });
			}
		}
		if(params['sid'].length === 0)
			{app.modals().error('No Spectra selected', 'Please select one or more spectra!');}
		
		var prefix = fun+'_';
		var params_str = 'sid=' + 
			JSON.stringify(params['sid']) + '&preview=' + (+preview) +'&'+ prefix + '=null';
	
		for(var key in params){
			if(key === 'sid') {continue;}
			if(params_str.length>0) {params_str +='&';}
		
			params_str += prefix + key+'='+params[key];
		}
	
		var url = '/nmr/plugins?'+params_str;
		//var ajax = pro.ajax();
		var ajax = require('./ajax');
		ajax.getJSON(url, function (response) {
				respond(response, preview);
		});
	}
	
	 function respond (json, preview) {
		if (json.constructor === Array) {
			for (var i = json.length - 1; i >= 0; i--) {
				respond(json[i]);
			}
			return;
		}
		var hooks = require('./plugin-hooks');
		
		var type = json['data_type'];
		if (type === undefined){ //if no data_type, it is assumed as spectrum
			type = 'spectrum';
		}
		if(typeof hooks[type] === 'function'){
			hooks[type](app, json, preview);
		}else{
			app.modals.error('Unsupported data-type', 
				'Couldn\'t find suitable function to read "'+type+'" data');
		}
		
	}
	return request;
};

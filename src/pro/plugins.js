module.exports = function (app) {
	function request (fun, params, s_id, preview) {
		params = params || {};
	
		var sel, all_sids;
		if(!params['sid']){
			if(s_id){
				params['sid'] = s_id;
			}else{
				sel = app.currentSlide().spectra(true);
				all_sids = sel.map(function (s) { return s.s_id(); });
				params['sid'] = all_sids.filter(function (e) { return e; });
			}
		}
		if(params['sid'].length === 0){
			var message = 'Please select one or more spectra!';
			if(all_sids.length > 0){ // if some s_ids were null;
				sel = app.currentSlide().spectra();
				var null_labels = sel.filter(function (s) { return !s.s_id(); })
					.map(function (s) { return s.label(); })
					.join(', ');
				
				message += '<br>NOTE: ['+ null_labels +'] spectra are stored locally' +
					' and not connected to the server.';
			}
			app.modals().error('No Spectra selected', message);
			return;
		}
		
		var prefix = fun+'_';
		var params_str = 'sid=' + 
			JSON.stringify(params['sid']) + '&preview=' + (+preview) +'&'+ prefix + '=null';
	
		for(var key in params){
			if(key === 'sid') {continue;}
			if(params_str.length>0) {params_str +='&';}
		
			params_str += prefix + key+'='+params[key];
		}
	
		var url = app.connect() + 'plugins?'+params_str;
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

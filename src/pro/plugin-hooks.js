function handle_peaks (app, json) {
	var spec = app.currentSlide().spectra().filter(function (s) {
		return s.s_id() === json['s_id'];
	});
	
	if (spec.length === 0){
		app.modals.error('Incompatible server response', 
		'Can\'t find spectrum with s_id:' + json['s_id']);
	}
	spec[0].addPeaks(json['peaks']);
}

function handle_segs (app, json) {
	var spec = app.currentSlide().spectra().filter(function (s) {
		return s.s_id() === json['s_id'];
	});
	
	if (spec.length === 0){
		app.modals.error('Incompatible server response', 
		'Can\'t find spectrum with s_id:' + json['s_id']);
	}
	
	for (var i = 0; i < json['segs'].length; i++) {
		spec[0].addSegmentl( json['segs'][i] );
	}
}


function handle_spec_feature (app, json, preview){
	if (json['peaks'] !== undefined){
		handle_peaks(app, json, preview);
	}
	if (json['segs'] !== undefined){
		handle_segs(app, json, preview);
	}
}

function handle_spectrum (app, json, preview){
	require('./process_data')
		.process_spectrum(json, app.currentSlide().addSpec);
}

module.exports.spectrum = handle_spectrum;
module.exports.spec_feature = handle_spec_feature;
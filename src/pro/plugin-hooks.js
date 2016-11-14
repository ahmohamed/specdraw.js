var annotation = {};
annotation.peaks = function (app, json, s_id) {
  var spec = app.allSpectra().filter(function (s) {
    return s.s_id() === s_id;
  });
  
  if (spec.length === 0){
    app.modals().error('Incompatible server response', 
    'Can\'t find spectrum with s_id:' + s_id);
    return;
  }
  spec[0].addPeaks(json['peaks']);
  spec[0].parentSlide().slideDispatcher().peakpick();
};

annotation.segs = function (app, json, s_id) {
  var spec = app.currentSlide().spectra().filter(function (s) {
    return s.s_id() === s_id;
  });
  
  if (spec.length === 0){
    app.modals().error('Incompatible server response', 
    'Can\'t find spectrum with s_id:' + s_id);
    return;
  }
  
  for (var i = 0; i < json['segs'].length; i++) {
    spec[0].addSegmentl( json['segs'][i] );
  }
  //TODO: dispatch event.
};

//TODO:handle_spec_like
function handle_spec_feature (app, json, preview){
  if (json['peaks'] !== undefined){
    handle_peaks(app, json, json['s_id']);
  }
  if (json['segs'] !== undefined){
    handle_segs(app, json, json['s_id']);
  }
}

function handle_spectrum (app, json, preview){
  if (json['data'] !== undefined){
    var slide;
    if (json['s_id'] !== undefined){
      spec = app.allSpectra().filter(function (s) {
        return s.s_id() === json['s_id'];
      });
      if (spec.length === 0){
        console.log("current_slide");
        slide = app.currentSlide();
      }else{
        slide = spec[0].parentSlide()
      }
    }
    slide.addSpec(json)
    
  }else{
    require('./process_data').process_annotation(app, json); // TODO:process_annotation is not defined!!
  }
}

var readers = {
  spectrum : handle_spectrum,
  spec_feature : handle_spec_feature
};

// module.exports.spectrum = handle_spectrum;
// module.exports.spec_feature = handle_spec_feature;
// module.exports.annotation = annotation;

module.exports.get_reader = function (reader_name) {
  if(readers[reader_name]){
    return readers[reader_name];
  }
  return undefined;
};
module.exports.add_reader = function (reader_name, fun) {
  readers[reader_name] = fun;
};
module.exports.get_annotation_reader = function (annotation_name) {
  if(annotation[annotation_name]){
    return annotation[annotation_name];
  }
  return undefined;
};
module.exports.add_annotation_reader = function (annotation_name, fun) {
  annotation[annotation_name] = fun;
};

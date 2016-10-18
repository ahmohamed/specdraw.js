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
  function process_annotation(processed_json) {
    if (json['annotation'] !== undefined){
      for (var i = 0; i < json['annotation'].length; i++) {
        e = json['annotation'][i];
        s_id = json['s_id'];
        
        var type = e["data_type"];
                
        if (type === undefined){
          for (key in e) {
            if(typeof annotation[key] !== 'function'){
              console.error("Can\'t handle annotation of data_type" + key);
            }else{
              arg = {};
              arg[key] = e[key];
              annotation[key](app, arg, s_id);
            }
          }
        }else if(typeof annotation[type] !== 'function'){
          console.error("Can\'t handle annotation of data_type" + type);
        }else{
          annotation[type](app, e, s_id);
        }
      }
    }
  }
  if (json['data'] !== undefined){
    require('./process_data')
      .process_spectrum(json, function (processed_json){
        app.currentSlide().addSpec(processed_json);
        console.log(processed_json);
        process_annotation(processed_json);
      }
    );
  }else{
    process_annotation(json);
  }
}

module.exports.spectrum = handle_spectrum;
module.exports.spec_feature = handle_spec_feature;
module.exports.annotation = annotation;
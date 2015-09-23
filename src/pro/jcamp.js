var converter = require('jcampconverter');


function jcamp_to_xy(spectrum) {
  var data = spectrum.data[0];
  var ret = [];
  for (var i = 0; i < data.length; i+=2) {
    ret.push({x:data[i], y:data[i+1]});
  }
  return ret;
}
function jcamp1d(result) {
  var spec_data = {};
  spec_data.data = jcamp_to_xy(result.spectra[0]);
  return spec_data;
}

function jcamp2d(result) {
  var spec_data = {};
  var spectra = result.spectra;
  
  var z_domain = d3.max( [Math.abs(result.minMax.minZ), Math.abs(result.minMax.maxZ)] );
  z_domain = [-z_domain, z_domain];
  
  var width = spectra.length, 
    height = spectra[0].nbPoints;
  
  var scale = d3.scale.linear().domain(z_domain).rangeRound([0,255]).clamp(true);
  
  var canvas = d3.select(document.createElement("canvas"))
      .attr("width", width)
      .attr("height", height)
      .style("width", width + "px")
      .style("height", height + "px")
      .node();
      
  var c = canvas.getContext("2d");
  var imageData = c.createImageData(width, height);
  
  
  var pos = 0, val;
  for (var y = height*2 -1; y > 0; y-=2) {
    for (var x = 0; x < width; x++) {
      val = scale( spectra[x].data[0][y] );
      imageData.data[pos++] = val;
      imageData.data[pos++] = val;
      imageData.data[pos++] = val;
      imageData.data[pos++] = 255; // opaque alpha
    }
  }

  c.putImageData(imageData, 0, 0, 0, 0, width, height);
  spec_data.data = canvas.toDataURL("image/png").replace('data:image/png;base64,','');
  spec_data.x_domain = [result.minMax.minX, result.minMax.maxX];
  spec_data.y_domain = [result.minMax.minY, result.minMax.maxY];
  spec_data.z_domain = z_domain;
  spec_data.nd = 2;
  spec_data.data_type = 'spectrum';
  spec_data.format = 'png';
  
  
  return spec_data;
}

module.exports = function(json, callback) {
  var result = converter.convert(json, {keepSpectra:true});
  
  var spec_data;
  if (result.twoD){
    spec_data = jcamp2d(result);
  }else{
    spec_data = jcamp1d(result);
  }
  
  spec_data.label = result.spectra[0].title;
  spec_data.x_label = result.xType;
  spec_data.y_label = result.yType;
  
  callback(spec_data);
};

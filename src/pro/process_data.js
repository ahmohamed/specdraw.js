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
        return(index%4 === 0);
    });
    
    callback(img_data);
  };
  
  img.src = "data:image/png;base64," + y;  
};

var process_png = function(pre_data, render_fun){
  if (pre_data['nd'] === 1){
    get_png_data(pre_data['y'], function(img_data){
      // Scaling X and Y
      var xscale = d3.scale.linear().range(pre_data['x_domain']).domain([0, img_data.length]);
      var yscale = d3.scale.linear().range(pre_data['y_domain']).domain([0, 255]);
    
      // Mapping data and rendering
      var data = img_data.map(function(d,i){ return {x:xscale(i), y:yscale(d)}; });
      render_fun(data);  
    });
  }
  
  if (pre_data['nd'] === 2){
    // Mapping data and rendering
    render_fun(pre_data);
  }
};

var process_xy = function(pre_data, render_fun){
  var data = pre_data.x.map(function(d,i){ return {x:d, y:pre_data.y[i]}; });  
  render_fun(data);
};

var process_b64 = function(pre_data, render_fun){
  var img_data = atob(pre_data['y']);
  console.log(img_data);
  // Scaling X and Y
  var xscale = d3.scale.linear().range(pre_data['x_domain']).domain([0, img_data.length]);
  var yscale = d3.scale.linear().range(pre_data['y_domain']).domain([0, 255]);

  // Mapping data and rendering
  var data = img_data.map(function(d,i){ return {x:xscale(i), y:yscale(d)}; });
  render_fun(data);  
};


var processPNG = function (json, callback) {
  if (!json['nd'] || json['nd'] === 1){
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
      var _16bit = (json['format'] === "png16");
      var len = _16bit? buffer.length/2: buffer.length;
      
      var yscale = d3.scale.linear().range(json['y_domain']).domain([0, 255]);
      if(_16bit) {yscale.domain([0,Math.pow(2,16)-1]);}
      
      for (var i = 0; i < len; i+=4) {
        if(!_16bit){
          img_data.push(yscale(buffer[i]));
        }else{
          img_data.push( yscale( (buffer[ i + len ] << 8) + buffer[i]) );
        }
      }
      
      if(json['x_domain']){
        var xscale = d3.scale.linear().range(json['x_domain']).domain([0, img_data.length]);
        img_data = img_data.map(function(d,i){ return {x:xscale(i), y:d}; });
      }
      
      //console.log("img_data",img_data);
      var ret;
      if(typeof json["s_id"] !== 'undefined'){
        ret = {data:img_data, s_id:json['s_id']};
      }else{ ret = {data:img_data}; }
      
      callback(ret);
    };
    var png_data = json['data']? json['data']: json['y'];
    img.src = "data:image/png;base64," + png_data;
  }else if (json['nd'] === 2){
    // Mapping data and rendering
    callback(json);
  }else{
    console.log("Unsupported data dimension: "+ json['nd']);
  }
};

var processPNGworker = function (json, callback) {
  if (!json['nd'] || json['nd'] === 1){
    var img = document.createElement("img");
  
    img.onload = function(){
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
  
      var e = {};
      e._16bit = (json['format'] === "png16");
      
      // Copy the image contents to the canvas
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);    
      e.buffer = ctx.getImageData(0,0,img.width,img.height).data;
      
      e.y_range = json['y_domain'];
      e.y_domain = [0, 255];
      if(e._16bit) {e.y_domain = [0,Math.pow(2,16)-1];}
      
      var worker_callback = function(e) {
        console.log('worker done');
        var img_data = [].slice.call(e.data);
        
        if(json['x_domain']){
          var xscale = d3.scale.linear().range(json['x_domain']).domain([0, img_data.length]);
          img_data = img_data.map(function(d,i){ return {x:xscale(i), y:d}; });
        }
      
        json['data'] = img_data;
        callback(json);
      };
      
      var worker_message = [e, [e.buffer.buffer]];
      
      require('./worker').addJob({message:worker_message, callback:worker_callback});
    };
    var png_data = json['data']? json['data']: json['y'];
    img.src = "data:image/png;base64," + png_data;
  }else if (json['nd'] === 2){
    // Mapping data and rendering
    callback(json);
  }else{
    console.log("Unsupported data dimension: "+ json['nd']);
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
function process_spectrum (json, render_fun){
  if(typeof json !== 'object'){ //it wasn't a json file.
    console.log(json, typeof json);
    return require('./jcamp')(json, render_fun);
  }
  if (json.constructor === Array) {
    for (var i = json.length - 1; i >= 0; i--) {
      process_spectrum(json[i], render_fun);
    }
    return;
  }
  switch (json['format']){
    case 'xy':
      process_xy(json, render_fun);
      break;
    case 'base64'://add base64 processing
      process_b64(json, render_fun);
      break;
    case 'png':
    case 'png16':
      if (require('./worker').maxWorkers() > 0){
        processPNGworker(json, render_fun);
      }else{
        processPNG(json, render_fun);
      }      
      break;
  }  
}

function get_spectrum (url, render_fun) {
  var ajax = require('./ajax');
  ajax.getJSON(url, function (response) {
    process_spectrum(response, render_fun);
  });
}

module.exports.get_spectrum = get_spectrum;
module.exports.process_spectrum = process_spectrum;
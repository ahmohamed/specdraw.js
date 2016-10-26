var workers_pool = [];
var MAX_WORKERS = (navigator.hardwareConcurrency || 2) -1;

function make_png_worker () {
  var png_worker = function () {
    function scale(range, domain){
      var domain_limits = domain[1] - domain[0];
      var range_limits = range[1] - range[0];
    
      return function(_){
        return ((_ - domain[0]) / domain_limits) * range_limits + range[0];
      };
    }
  
    self.onmessage = function(e, buf){
      e = e.data;
      var buffer = e.buffer;
      var len = e._16bit? buffer.length/2: buffer.length;
    
      var yscale = scale(e.y_range, e.y_domain);
      var img_data = new Float64Array(len/4);
    
      for (var i = 0; i < len; i+=4) {
        if(! e._16bit){
          img_data[i/4] = yscale(buffer[i]);
        }else{
          img_data[i/4] = yscale( (buffer[ i + len ] << 8) + buffer[i] );
        }
      }
      self.postMessage(img_data, [img_data.buffer]);
    };  
  };
  var blob = new Blob(['('+ png_worker.toString() +')()'],
    { type: 'application/javascript' });
  var blobURL = window.URL.createObjectURL(blob);
  var worker = new Worker(blobURL);  
  return worker;
}

var q = [];

function next (worker) {
  var job = q.shift();
  if (!job) // if the queue is finished.
    return;
  
  worker.hasJob = true;
  worker.onmessage = function (e) {
    var callback = job['callback'];
    worker.hasJob = false;
    next(worker);
    callback(e);
  };
  worker.postMessage(job['message'][0], job['message'][1]);
};

function addJob (_) {
  q.push(_);
  var free_worker = getFreeWorker();
  if ( typeof free_worker !== 'undefined'){ //if there is a currently free worker, start this job.
    next(free_worker);
  }
};

function getFreeWorker() {
  for (var i = 0; i < workers_pool.length; i++) {
    if (! workers_pool[i].hasJob){
      return workers_pool[i];
    }
  }
  if (workers_pool.length < MAX_WORKERS){
    var new_worker = make_png_worker();
    workers_pool.push(new_worker);
    return new_worker;
  }
  return undefined;
}

function maxWorkers(_) {
  if (!arguments.length) return MAX_WORKERS;
  MAX_WORKERS = _;
}

module.exports.addJob = addJob;
module.exports.maxWorkers = maxWorkers;
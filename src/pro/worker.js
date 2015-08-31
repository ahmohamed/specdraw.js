var make_png_worker = function () {
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

pro.worker = make_png_worker();
pro.worker_queue = function (worker) {
	var q = [], job;
	var init = {};
	init.next = function () {
		job = q.shift();
		if (!job) // if the queue is finished.
			return;
		
		worker.onmessage = function (e) {
			var callback = job['callback'];
			init.next();
			callback(e);
		};
		worker.postMessage(job['message'][0], job['message'][1]);
	};
	init.addJob = function (_) {
		q.push(_);
		if (!job) //if not job is currently excuting, do this job.
			init.next();
	};
	return init;
};
pro.worker.queue = pro.worker_queue(pro.worker);
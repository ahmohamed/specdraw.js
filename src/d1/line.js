spec.d1.line = function () {
	var data, dataResample, dispatcher, data_slice, path, x, y, range={}, width, height, svg_elem;
	
	function _main(svg) {
		path = d3.svg.line()
			.x(function(d) { return x(d.x); })
			.y(function(d) { return y(d.y); });
		
		width = svg.attr("width")
		
		svg_elem = svg.append("g")
			.attr("class", "spec-line")
			.attr("clip-path","url(#clip)")
			.datum(range);
		
		var path_elem = svg_elem.append("path")
      .datum(data)
			.attr("class", "line")
			/*.on("blur", function(){
				path_elem.style("stroke", "steelblue")
			})
			.attr("focusable", true)
			.on("focus", function(){path_elem.style("stroke", "green")});*/
		
		var _crosshair = (spec.d1.crosshair() 
			.datum(data)
			.xScale(x)
			.yScale(y)
			.dispatcher(dispatcher)
			)(svg_elem);
		
		var _integrate = (spec.d1.integrate() 
			.xScale(x)
			.yScale(y)
			.dispatcher(dispatcher)
			)(svg_elem);
		
		svg_elem
			.on("_redraw", function(e){
				path_elem.attr("d", path);			
			})
			.on("_regionchange", function(e){
				if(e.xdomain){
					data_slice = sliceData(data, x.domain(), range.x);
					dataResample = resample(data.slice(data_slice.start, data_slice.end), x.domain(), width);		
					
					path_elem.datum(dataResample);
					range.y = d3.extent(dataResample.map(function(d) { return d.y; }));
					//scale=1
					
					_crosshair.node().dataSlice([data_slice.start, data_slice.end]);
				}
			})
			.on("_integrate", function(e){
				var integ_slice = sliceData(data, e.xdomain, range.x)
				_integrate.node().addIntegral (data.slice(integ_slice.start, integ_slice.end));
			});
		
		// Register event listeners
		var dispatch_idx = +d3.select(".all-panels").attr("dispatch-index");
		dispatcher.on("regionchange.line."+dispatch_idx, svg_elem.on("_regionchange"));
		dispatcher.on("redraw.line."+dispatch_idx, svg_elem.on("_redraw"));
		dispatcher.on("integrate.line."+dispatch_idx, svg_elem.on("_integrate"));
		d3.select(".all-panels").attr("dispatch-index", dispatch_idx + 1);
		
		return svg_elem;									
	}
	
  _main.datum = function(_){
    if (!arguments.length) return data;
    data = _;
		
		range.x = [data[0].x, data[data.length-1].x];
		range.y = d3.extent(data.map(function(d) { return d.y; }));
		
    return _main;
  };
	
  _main.dispatcher = function(_){
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return _main;
  };
	
  _main.xScale = function(_){
    if (!arguments.length) return x;
    x = _;
    return _main;
  };

  _main.yScale = function(_){
    if (!arguments.length) return y;
    y = _;
    return _main;
  };
	
	return _main;
};

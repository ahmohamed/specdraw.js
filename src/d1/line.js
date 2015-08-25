spec.d1.line = function () {
	var data, x, y, s_id, dispatcher, range={}, svg_elem, hasCrosshair = true;
	
	function _main(svg) {
		var _crosshair, dataResample, data_slice, segments = [], scale_factor = 1;
		
		var path = d3.svg.line()
			.x(function(d) { return x(d.x); })
			.y(function(d) { return y(d.y * scale_factor); });
		
		var width = svg.attr("width")
		
		svg_elem = svg.append("g")
			.attr("class", "spec-line")
			.attr("clip-path","url(#clip)")
		
		svg_elem.node().range = range;
			
		var line_idx = svg.node().nSpecs;
		svg_elem.node().line_idx = line_idx;
		
		var path_elem = svg_elem.append("path")
      .datum(data)
			.attr("class", "line clr"+ line_idx)
		
		if(hasCrosshair)
			_crosshair = (spec.d1.crosshair() 
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
				if(e.x){
					path_elem.attr("d", path)
						.attr("transform", 'scale(1,1)translate(0,0)');
					svg_elem.selectAll(".segment").attr("d", path);
				}else{ //change is in the Y axis only.
					var orignial_xscale = x.copy().domain(svg.node().range.x),
						orignial_yscale = y.copy().domain(svg.node().range.y);
					
						var translate_coor = [0,
			 				-Math.min(orignial_yscale(y.domain()[1]), orignial_yscale(y.domain()[0]) )];

						var	scale_coor = [ 1,
						  Math.abs((svg.node().range.y[0]-svg.node().range.y[1])/(y.domain()[0]-y.domain()[1]))];
						
						path_elem.attr("transform","scale("+scale_coor+")"+"translate("+ translate_coor +")");
				}
			})
			.on("_regionchange", function(e){
				if(e.xdomain){
					var new_slice = sliceDataIdx(data, x.domain(), range.x);

					data_slice = new_slice;
					
					dataResample = resample(data.slice(data_slice.start, data_slice.end), x.domain(), width);
					path_elem.datum(dataResample);
					
					// if the number data points in the path is less that 
					// the number of pixels, interpolate between points to
					// avoid pixelation.
					if(dataResample.length < width){
						path.interpolate('cardinal');
					}else{
						// In large number of data points, cardinal interpolation
						// has a pronounced effect on efficiency with no visual
						// enhancement. Use linear instead.
						path.interpolate('linear');
					}
						
					range.y = d3.extent(dataResample.map(function(d) { return d.y; }));
					range.y[0] *= scale_factor;
					range.y[1] *= scale_factor;
					//scale=1
					
					svg_elem.selectAll(".segment").remove();
					segments.forEach(function (e) {
						var seg_data = dataResample.filter(function (d) {
							return d.x < e[0] &&  d.x > e[1];
						})
						svg_elem.append("path")
				      .datum(seg_data)
							.attr("class", "segment");				
					});
					
					if(hasCrosshair)
						_crosshair.node().dataSlice([data_slice.start, data_slice.end]);
				}
			})
			.on("_integrate", function(e){
				var sliced_data = getSlicedData(data, e.xdomain, range.x);

				_integrate.node().addIntegral (sliced_data);
				svg_elem.node().addSegment([sliced_data[0].x, sliced_data[sliced_data.length-1].x]);
				dispatcher.redraw({y:true});
			})
			.on("_segment", function (e) {
			});
		
		// Register event listeners
		var dispatch_idx = ++dispatcher.idx;
		dispatcher.on("regionchange.line."+dispatch_idx, svg_elem.on("_regionchange"));
		dispatcher.on("redraw.line."+dispatch_idx, svg_elem.on("_redraw"));
		dispatcher.on("integrate.line."+dispatch_idx, svg_elem.on("_integrate"));
		
		svg_elem.node().specData = function () { return data;	};
		//TODO: Update peaks, integrate, segments to match new data.
		svg_elem.node().setData = function (_) {
			if(!_[0].x){ //if data is array, not xy format
				data = _.map(function(d,i){ return {x:data[i].x, y:d}; });
			}else{
				data = _;
			}
			range.y = d3.extent(data.map(function(d) { return d.y; }));
			if(_crosshair) _crosshair.node().setData(data);
			
			svg_elem.on("_regionchange")({xdomain:x.domain()});
			svg_elem.on("_redraw")({x:true});
		};
		svg_elem.node().dataSlice = function () { return data_slice;	};
		svg_elem.node().specRange = function () { return range;	};
		svg_elem.node().s_id = function (_) { 
			if (!arguments.length)
				return s_id; 
			s_id = _;
		};
		svg_elem.node().setScaleFactor = function (_) {
			if (!arguments.length) return scale_factor;
			scale_factor = _;
			svg_elem.on("_redraw")({y:true});
		};
		svg_elem.node().addPeaks = function (idx) { //TODO:assign color to peaks
			svg.select(".peaks").node().addpeaks(data.subset(idx), line_idx);			
			svg.select(".peaks").on("_regionchange")({xdomain:true});
			svg.select(".peaks").on("_redraw")({x:true});			
		};
		svg_elem.node().addSegment = function (seg) {
			if(seg[0].constructor === Array){
				for (var i = seg.length - 1; i >= 0; i--)
					this.addSegment(seg[i]);				
			}else{
				segments.push(seg);
				var seg_data = dataResample.filter(function (d) {
					return d.x <= seg[0] &&  d.x >= seg[1];
				});
			
				svg_elem.append("path")
		      .datum(seg_data)
					.attr("class", "segment")
					.attr("d", path);
			}
		};
		svg_elem.node().addSegmentByIndex = function (seg) {
			if(seg[0].constructor === Array){
				for (var i = seg.length - 1; i >= 0; i--)
					this.addSegmentByIndex(seg[i]);				
			}else{
				this.addSegment([data[seg[0]].x, data[seg[1]].x]);
			}
		};
		svg_elem.node().remove = function () {
			dispatcher.on("regionchange.line."+dispatch_idx, null);
			dispatcher.on("redraw.line."+dispatch_idx, null);
			dispatcher.on("integrate.line."+dispatch_idx, null);
			data = null;
			if(hasCrosshair)
				_crosshair.node().remove();
			svg_elem.remove();
		};
		
		return svg_elem;									
	}
	
  _main.datum = function(_){
    if (!arguments.length) return data;
		if(!_[0].x){ //if data is array, not xy format
			var xscale = d3.scale.linear()
				.range(svg.node().range.x)
				.domain([0, _.length]);
			
			data = _.map(function(d,i){ return {x:xscale(i), y:d}; });
		}else{
    	data = _;
		}
		
		range.x = [data[0].x, data[data.length-1].x];
		range.y = d3.extent(data.map(function(d) { return d.y; }));
		
    return _main;
  };
	
  _main.dispatcher = function(_){
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return _main;
  };
  _main.crosshair = function(_){
    if (!arguments.length) return hasCrosshair;
    hasCrosshair = _;
    return _main;
  };
  _main.s_id = function(_){
    if (!arguments.length) return s_id;
    s_id = _;
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

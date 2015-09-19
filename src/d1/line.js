spec.d1.line = function () {
	var utils = require('./src/utils');
	var core = require('./src/elem');
	var path_elem = require('./src/d1/path-simplify')();
	var source = core.SVGElem().class('spec-line');
	core.inherit(SpecLine, source);
	
	
	var data, s_id, spec_label, _crosshair;	//initiailized by parent at generation
	var x, y, dispatcher;								//initiailized by parent at rendering
	var line_idx, range={}, svg_elem;		//initialized by self at rendering
	var i_to_pixel; 										//a scale to convert data point to pixel position
	var ppm_to_i; 											//a scale to convert ppm to data point (reverse of data[i].x)
	
	var data_slice, scale_factor = 1;
	var peaks = [], segments = [];
	
	
	function SpecLine(spec_container) {
		x = SpecLine.xScale();
		y = SpecLine.yScale();
		dispatcher = SpecLine.dispatcher();
		i_to_pixel = x.copy();
		
		//var width = spec_container.width();
		svg_elem = source(spec_container);
		line_idx = spec_container.spectra().indexOf(SpecLine);
				
		path_elem.datum(data)
			.xScale(x)
			.yScale(y)
			.simplify(2)
			.class("line clr"+ line_idx)
			(svg_elem);
		
		if(typeof _crosshair === 'undefined'){
			SpecLine.crosshair(true);
		}
		if(_crosshair){
			_crosshair.xScale(x)
				.yScale(y)
				.dispatcher(dispatcher)
				(SpecLine);
		}
			
		
		var _integrate = (spec.d1.integrate() 
			.xScale(x)
			.yScale(y)
			.dispatcher(dispatcher)
			)(svg_elem);
		
		svg_elem
			.on("_redraw", function(e){
				if(e.x){
					path_elem.redraw().sel()
						.attr("transform", 'scale(1,1)translate(0,0)');
					
					//svg_elem.selectAll(".segment").attr("d", path);
				}else{ //change is in the Y axis only.
					var orignial_yscale = y.copy().domain(spec_container.range().y);
					
					var translate_coor = [0,
		 				-Math.min(orignial_yscale(y.domain()[1]), orignial_yscale(y.domain()[0]) )];

					var	scale_coor = [ 1,
					  Math.abs((spec_container.range().y[0]-spec_container.range().y[1])/(y.domain()[0]-y.domain()[1]))];
				
					path_elem.sel()
						.attr("transform","scale("+scale_coor+")"+"translate("+ translate_coor +")");
					svg_elem.selectAll(".segment")
						.attr("transform","scale("+scale_coor+")"+"translate("+ translate_coor +")");
				}
			})
			.on("_regionchange", function(e){
				if(e.xdomain){
					//var new_slice = utils.sliceDataIdx(data, x.domain(), range.x);
					data_slice = e.xdomain.map(SpecLine.ppmToi);
					i_to_pixel.domain( data_slice );
					
					//TODO: resample factors both x and y dimensions.
					// Both dimension need to have the same unit, i.e. pixels.										
					path_elem.datum( Array.prototype.slice.apply(data, data_slice) );
					range.y = path_elem.range().y;
					range.y[0] *= scale_factor;
					range.y[1] *= scale_factor;
					
					/*svg_elem.selectAll(".segment").remove();
					segments.forEach(function (e) {
						var seg_data = dataResample.filter(function (d) {
							return d.x < e[0] &&  d.x > e[1];
						});
						svg_elem.append("path")
				      .datum(seg_data)
							.attr("class", "segment");				
					});
          */
					
				}
			})
			.on("_integrate", function(e){
				//var segment = e.xdomain.map(SpecLine.ppmToi).sort(d3.ascending);
				var sliced_data = utils.sliceData(data, e.xdomain, range.x);

				_integrate.node().addIntegral (sliced_data);
				svg_elem.node().addSegment([sliced_data[0].x, sliced_data[sliced_data.length-1].x]);
				dispatcher.redraw({y:true});
			})
			.on("_segment", function () {
			});
		
		// Register event listeners
		var dispatch_idx = ++dispatcher.idx;
		dispatcher.on("regionchange.line."+dispatch_idx, svg_elem.on("_regionchange"));
		dispatcher.on("redraw.line."+dispatch_idx, svg_elem.on("_redraw"));
		dispatcher.on("integrate.line."+dispatch_idx, svg_elem.on("_integrate"));
		
		svg_elem.on('remove', function () {
			dispatcher.on("regionchange.line."+dispatch_idx, null);
			dispatcher.on("redraw.line."+dispatch_idx, null);
			dispatcher.on("integrate.line."+dispatch_idx, null);
			data = null;
			if(_crosshair){
				_crosshair.remove();				
			}
		});
		
		/*svg_elem.node().addSegment = function (seg) {
			if(seg[0].constructor === Array){
				for (var i = seg.length - 1; i >= 0; i--){
					this.addSegment(seg[i]);					
				}
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
				for (var i = seg.length - 1; i >= 0; i--){
					this.addSegmentByIndex(seg[i]);				
				} 
			}else{
				this.addSegment([data[seg[0]].x, data[seg[1]].x]);
			}
		};*/
		
		//SpecLine.addPeaks([100,1000,2000]);
		return svg_elem;									
	}
	function redraw(x, y) {
		if (!svg_elem){ return; }
		svg_elem.on("_redraw")({x:x, y:y});
	}
	function render_data() {
		//TODO: Update peaks, integrate, segments to match new data.
		if (!svg_elem){ return; }
		svg_elem.on("_regionchange")({xdomain:x.domain()});
		svg_elem.on("_redraw")({x:true});
	}
	
	SpecLine.addSegment = function (_) {
		segments.push(_);
	};
	SpecLine.delSegment = function (between) {
		peaks = peaks.filter(function (e) {
			//retain all peaks NOT within the region.
			return !(e >= between[0] && e <= between[1]);
		});
	};
	SpecLine.segments = function (visible) {
		var idx = segments;
		if(visible){ //get only peaks in the visible range (within dataSlice)
			idx = idx.filter(function (e) {
				return e[0] > data_slice[0] && 
					e[0] < data_slice[1] &&
					e[1] > data_slice[0] && 
					e[1] < data_slice[1];
			});
		}
		return idx;
	};
	SpecLine.addPeaks = function (idx) {
		peaks = peaks.concat(idx);
		console.log(peaks);
	};
	SpecLine.delPeaks = function (between) {
		between = between.map(SpecLine.ppmToi).sort(d3.ascending);
		peaks = peaks.filter(function (e) {
			//retain all peaks NOT within the region.
			return !(e >= between[0] && e <= between[1]);
		});
	};
	SpecLine.peaks = function (visible) {
		var idx = peaks;
		if(visible){ //get only peaks in the visible range (within dataSlice)
			idx = idx.filter(function (e) {
				return e > data_slice[0] && e < data_slice[1];
			});
		}
		return data.subset(idx);
	};
	SpecLine.iToPixel = function (_) {
		return i_to_pixel(_);
	};
	SpecLine.pixelToi = function (_) {
		return Math.round( i_to_pixel.invert(_) );
	};
	SpecLine.ppmToi = function (_) {
		console.log('ppm', _);
		var i = Math.round( ppm_to_i(_) );
		i = i > data.length-1 ? data.length-1 : i;
		i = i < 0 ? 0 : i;
		
		if (data[i-1] && Math.abs(_ - data[i].x) > Math.abs(_ - data[i-1].x) ){
			i--;
		}else if(data[i+1] && Math.abs(_ - data[i].x) > Math.abs(_ - data[i+1].x) ){
			i++;
		}
		return i;
	};
  SpecLine.range = function () {
  	return range;
  };
	SpecLine.datum = function(_){
    if (!arguments.length) {return data;}
		if(!_[0].x){ //if data is array, not xy format
			if ( data  && data.length === _.length){ // if we are replacing existing data
				// Use the x-coordinates of the old data.
				data = _.map(function(d,i){ return {x:data[i].x, y:d}; });
			}else{
				// Otherwise, create a linespace over the x-axis 
				// over the range of the parent container.
				var xscale = d3.scale.linear()
					.range(SpecLine.parent().range().x)
					.domain([0, _.length]);
			
				data = _.map(function(d,i){ return {x:xscale(i), y:d}; });				
			}
		}else{ // Data is in XY format.
    	data = _;
		}
		
		range.x = [data[0].x, data[data.length-1].x];
		range.y = d3.extent(data.map(function(d) { return d.y; }));
		
		//TODO: Update peaks, integrate, segments to match new data.
		if(_crosshair){
			_crosshair.datum(data);
		}
		ppm_to_i = d3.scale.linear()
			.range([0, data.length])
			.domain([ data[0].x, data[data.length-1].x ]);
		
		render_data();
    return SpecLine;
  };
  SpecLine.label = function(_){
    if (!arguments.length) {return spec_label;}
    spec_label = _;
    return SpecLine;
  };
  SpecLine.crosshair = function(_){
    if (!arguments.length) {return _crosshair;}
		
		if(_){
			_crosshair = require('./src/d1/crosshair')().datum(data);
		} else {
			_crosshair = false;
		}			
		
    return SpecLine;
  };
  SpecLine.s_id = function(_){
    if (!arguments.length) {return s_id;}
    s_id = _;
    return SpecLine;
  };	
  
	SpecLine.lineIdx = function () {
		return line_idx;
	};
	SpecLine.scaleFactor = function (_) {
		if (!arguments.length) {return scale_factor;}
		scale_factor = _;
		redraw();
		return SpecLine;
	};
	
	return SpecLine;
};

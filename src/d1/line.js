function calcReductionFactor(spec_container) {
	var seg_len = [];
	var specs = spec_container.spectra();
	for (var i = 0; i < specs.length; i++) {
		seg_len = seg_len.concat(
			specs[i].segments(true).map(
			function (s) {
				return s.integValue();
			})
		);
	}
	
	var red = d3.max( seg_len ) / (spec_container.yScale().domain()[1]*0.5);
	
	spec_container.spectra().forEach(function (s) {
		s.segments(true).forEach(function (seg) {
			seg.reductionFactor(red);
		});
	});
	
	return d3.max( seg_len ) / 0.5;
}
function get_integ_factor(spec_container) {
	var specs = spec_container.spectra();
	var integ_factor;
	for (var i = 0; i < specs.length; i++) {
		var segs = specs[i].segments();
		for (var j = 0; j < segs.length; j++) {
			integ_factor = segs[j].integFactor();
			if(integ_factor){ return integ_factor;}
		}
	}
}

module.exports = function () {
	var core = require('../elem');
	var path_elem = require('./path-simplify')();
	var source = core.SVGElem().class('spec-line');
	core.inherit(SpecLine, source);
	
	
	var data, s_id, spec_label, _crosshair;	//initiailized by parent at generation
	var x, y, dispatcher;								//initiailized by parent at rendering
	var line_idx, range={}, svg_elem;		//initialized by self at rendering
	var i_to_pixel; 										//a scale to convert data point to pixel position
	var ppm_to_i; 											//a scale to convert ppm to data point (reverse of data[i].x)
	
	var selected = true;
	var data_slice, scale_factor = 1;
	var peaks = [], segments = core.ElemArray();
	
	
	function SpecLine(spec_container) {
		x = SpecLine.xScale();
		y = SpecLine.yScale();
		dispatcher = SpecLine.dispatcher();
		i_to_pixel = x.copy();
		
		//var width = spec_container.width();
		line_idx = spec_container.spectra().indexOf(SpecLine);
		svg_elem = source(spec_container)
			.classed('selected', selected)
			.classed('clr'+line_idx, true);
		
		
				
		path_elem.datum(data)
			.xScale(x)
			.yScale(y)
			.simplify(1)
			.class("line")
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
			
		for (var i = 0; i < segments.length; i++) {
			render_segment(segments[i]);
		}
		
		svg_elem
			.on("_redraw", function(e){
				if(e.x){
					path_elem.redraw().sel()
						.attr("transform", 'scale(1,1)translate(0,0)');
					
					//integration
					calcReductionFactor(spec_container);
				}else{ //change is in the Y axis only.
					var orignial_yscale = y.copy().domain(spec_container.range().y);
					
					var translate_coor = [0,
		 				-Math.min(orignial_yscale(y.domain()[1]), orignial_yscale(y.domain()[0]) )];

					var	scale_coor = [ 1,
					  Math.abs((spec_container.range().y[0]-spec_container.range().y[1])/(y.domain()[0]-y.domain()[1]))];
				
					path_elem.sel()
						.attr("transform","scale("+scale_coor+")"+"translate("+ translate_coor +")");
				}
			})
			.on("_regionchange", function(e){
				if(e.xdomain){
					data_slice = e.xdomain.map(SpecLine.ppmToi);
					i_to_pixel.domain( data_slice );
					
					//TODO: resample factors both x and y dimensions.
					// Both dimension need to have the same unit, i.e. pixels.										
					path_elem.datum( Array.prototype.slice.apply(data, data_slice) );
					range.y = path_elem.range().y;
					range.y[0] *= scale_factor;
					range.y[1] *= scale_factor;
					
				}
			})
			.on("_integrate", function(e){
				var s = e.xdomain.map(SpecLine.ppmToi).sort(d3.ascending);
				SpecLine.addSegment(s);
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
		
		//SpecLine.addSegment([1000,1050]);
		return svg_elem;									
	}
	function render_segment(s) {
		if (!svg_elem){ return; }
		
		s.xScale(x).yScale(y)
			.dispatcher(dispatcher)
			(SpecLine);
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
		var integ_elem = require('./integration-elem')()
			.segment(_)
			.integFactor(get_integ_factor(SpecLine.parent()));
		
		segments.push(integ_elem);
		
		render_segment(integ_elem);
		calcReductionFactor( SpecLine.parent() );
	};
	SpecLine.delSegment = function (between) {
		segments = segments.filter(function (e) {
			//retain all peaks NOT within the region.
			return !(e >= between[0] && e <= between[1]);
		});
	};
	SpecLine.segments = function (visible) {
		var idx = segments;
		if(visible){ //get only peaks in the visible range (within dataSlice)
			idx = idx.filter(function (s) {
				var e = s.segment();
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
		
		ppm_to_i = d3.scale.linear()
			.range([0, data.length])
			.domain([ data[0].x, data[data.length-1].x ]);
		
		//TODO: Update peaks, integrate, segments to match new data.
		if(dispatcher)
			{dispatcher.specDataChange(SpecLine);}

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
			_crosshair = require('./crosshair')().datum(data);
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
  SpecLine.selected = function(_){
    if (!arguments.length) {return selected;}
    selected = _;
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

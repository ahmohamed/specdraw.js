module.exports = function () {
	var core = require('../elem');
	var source = core.SVGElem().class('spec-img');
	core.inherit(_main, source);
	
	var data, s_id, spec_label, _crosshair;	//initiailized by parent at generation
	var x, y, dispatcher;								//initiailized by parent at rendering
	var svg_elem, img_elem, line_idx, range={};		//initiailized by self at rendering
	
	
	function _main(spec_container) {
		x = _main.xScale();
		y = _main.yScale();
		dispatcher = _main.dispatcher();
		
		svg_elem = source(spec_container);
		line_idx = spec_container.spectra().indexOf(_main);
		
		//svg_elem.attr("clip-path","url(#" + svg_elem.selectP('.spec-slide').node().clip_id + ")");

		img_elem = svg_elem.append("g")
			.attr("filter", "url(#" + spec_container.parent().filterId()+ ")")
			.append("svg:image")
			  .attr('width', spec_container.width())
			  .attr('height', spec_container.height())
			  .attr('xlink:href', "data:image/png;base64," + data)
			  .attr("preserveAspectRatio", "none");	
				
		
		/*** TODO: 2D dataset vis *****
		******************************/
		
		if(_crosshair){
			_crosshair 
				.xScale(x).yScale(y)
				.dispatcher(dispatcher)
				(_main);
		}
			
		
		// TODO: 2D integration
		
		svg_elem
			.on("_redraw", redraw)
			.on("_regionchange", function(){
			})
			.on("_integrate", function(){
			})
			.on("_segment", function () {
			})
			.on('_remove', function () {
				dispatcher.on("regionchange.line."+dispatch_idx, null);
				dispatcher.on("redraw.line."+dispatch_idx, null);
				data = null;
				if(_crosshair){_crosshair.remove();}
			});
		
		// Register event listeners
		var dispatch_idx = ++dispatcher.idx;
		dispatcher.on("regionchange.line."+dispatch_idx, svg_elem.on("_regionchange"));
		dispatcher.on("redraw.line."+dispatch_idx, svg_elem.on("_redraw"));
				
		return svg_elem;									
	}
	function redraw() {
		if (!img_elem) {return;}
		
		var orignial_xscale = x.copy().domain(range.x),
			orignial_yscale = y.copy().domain(range.y);

		//zooming on 2d picture by first translating, then scaling.
		var translate_coor = [-Math.min(orignial_xscale(x.domain()[1]), orignial_xscale(x.domain()[0])),
			 				-Math.min(orignial_yscale(y.domain()[1]), orignial_yscale(y.domain()[0]) )];

		var	scale_coor = [ Math.abs((range.x[0]-range.x[1])/(x.domain()[0]-x.domain()[1])),
						   Math.abs((range.y[0]-range.y[1])/(y.domain()[0]-y.domain()[1]))];

		img_elem.attr("transform","scale("+scale_coor+")"+"translate("+ translate_coor +")");
	}
	function render_data() {
		if (!img_elem) {return;}
		
		img_elem.attr('xlink:href', "data:image/ png;base64," + data);
		redraw();
	}
	
  _main.datum = function(_){
    if (!arguments.length) {return data;}
		data = _;
		
		render_data();
		return _main;
  };
  _main.range = function(_){
		if (!arguments.length) {return range;}
		range = _;
		return _main;
  };
  _main.crosshair = function(_){
    if (!arguments.length) {return _crosshair;}

		if(_){
			_crosshair = require('./crosshair-2d')();
		} else {
			_crosshair = false;
		}    return _main;
  };
  _main.s_id = function(_){
    if (!arguments.length) {return s_id;}
    s_id = _;
    return _main;
  };
  _main.label = function(_){
    if (!arguments.length) {return spec_label;}
    spec_label = _;
    return _main;
  };
	_main.lineIdx = function () {
		return line_idx;
	};
	
	return _main;
};

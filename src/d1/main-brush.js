spec.d1.mainBrush = function(){
	var svg_elem, x, y, dispatcher;
	
	function _main(svg) {
		function makeBrushEvent() {
			if (_brush.empty()){
				if(x && y) _brush.extent([[0,0],[0,0]]);
				else{ _brush.extent([0,0]); }
				
				svg_elem.call(_brush);
				return null;
    	}
			var e = {}
			if(x && y){
				e.xdomain = [_brush.extent()[1][0], _brush.extent()[0][0]];
				e.ydomain = [_brush.extent()[1][1], _brush.extent()[0][1]];				
			}else{
				e.xdomain = x? _brush.extent().reverse():null;
				e.ydomain = y? _brush.extent():null;
			}		
			
			_brush.clear();				
			svg_elem.call(_brush);
			return e;
		};
		function changeRegion () {			
			var e = makeBrushEvent();
			if(e)
				svg.on("_regionchange")(e);
    };		
		function peakdel () {
			var e = makeBrushEvent();
			if(e)
				dispatcher.peakdel(e);
    };
		function integrate () {
			var e = makeBrushEvent();
			if(e)
				dispatcher.integrate(e);
    };
		function peakpick() {
			_brush.clear()
			svg_elem.call(_brush);
		};

		var width = svg.attr("width"),
				height = svg.attr("height");
		
	  var _brush = d3.svg.brush()
			.x(x)
			.y(y)
	    .on("brushend", changeRegion);
		
		svg_elem = svg.append("g")
			.attr("class", "main-brush")
			.call(_brush);
				
		svg_elem.selectAll("rect")
			.attr("height", height);
		
		svg_elem.select(".background")
			.style('cursor', null)
			.style('pointer-events', 'all');
		
		svg.style("cursor", "crosshair");
		
		svg_elem.node().peakpickEnable = function (_) {
			svg_elem.classed("peakpick-brush", _);
			svg
				.style("cursor", _? 'url('+cursor.peakpick+'), auto' : "crosshair");
			
			_brush.on("brushend", _? peakpick : changeRegion);
		};
		svg_elem.node().peakdelEnable = function (_) {
			svg_elem.classed("peakdel-brush", _);
			svg
					.style("cursor", _? 'url('+cursor.peakdel+'), auto' : "crosshair");
			
			_brush.on("brushend", _? peakdel : changeRegion);
		};
		svg_elem.node().integrateEnable = function (_) {
			svg_elem.classed("integrate-brush", _);
			svg
					.style("cursor", _? 'url('+cursor.addinteg+'), auto' : "crosshair");
			
			_brush.on("brushend", _? integrate : changeRegion);
		};
	
		// Register event listeners
		var dispatch_idx = ++dispatcher.idx;		
		dispatcher.on("peakpickEnable.brush."+dispatch_idx, svg_elem.node().peakpickEnable);
		dispatcher.on("peakdelEnable.brush."+dispatch_idx, svg_elem.node().peakdelEnable);
		dispatcher.on("integrateEnable.brush."+dispatch_idx, svg_elem.node().integrateEnable);
		
		return svg_elem;									
	}

  _main.dispatcher = function(_){
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return _main;
  }
	
  _main.xScale = function(_){
    if (!arguments.length) return x;
    x = _;
    return _main;
  }

  _main.yScale = function(_){
    if (!arguments.length) return y;
    y = _;
    return _main;
  }
	
	return _main;
};

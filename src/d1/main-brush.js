spec.d1.mainBrush = function(){
	var svg_elem, x, y, dispatcher;
	
	function _main(svg) {
		function changeRegion () {
			if (_brush.empty()){
				_brush.extent([0,0]);
				svg_elem.call(_brush);
				return;
    	}
	
			var e = {xdomain:_brush.extent().reverse()}
			_brush.clear();				
			svg_elem.call(_brush);
			svg.on("_regionchange")(e);
    };
		
		function peakdel () {
			if (_brush.empty()){
				_brush.extent([0,0]);
				svg_elem.call(_brush);
				return;
    	}
	
			var e = {xdomain:_brush.extent().reverse()}
			_brush.clear();
			svg_elem.call(_brush);
			dispatcher.peakdel(e);
    };

		function integrate () {
			if (_brush.empty()){
				_brush.extent([0,0]);
				svg_elem.call(_brush);
				return;
    	}
	
			var e = {xdomain:_brush.extent().reverse()}
			_brush.clear();
			svg_elem.call(_brush);
			dispatcher.integrate(e);
    };
		
		var width = svg.attr("width"),
				height = svg.attr("height");
		
	  var _brush = d3.svg.brush()
			.x(x)
	    .on("brushend", changeRegion);
		
		svg_elem = svg.append("g")
			.attr("class", "main-brush")
			.call(_brush);
				
		svg_elem.selectAll("rect")
			.attr("height", height);
		
		svg_elem.select(".background")
			.style('pointer-events', 'all');
		
		svg_elem.node().peakpickEnable = function (_) {
			svg_elem.classed("peakpick-brush", _)
			d3.select(".all-panels")
				.style("cursor", _? 'url('+cursor.peakpick+'), auto' : "auto");
		};
		svg_elem.node().peakdelEnable = function (_) {
			svg_elem.classed("peakdel-brush", _)
				.select(".background")
					.style("cursor", _? 'url('+cursor.peakdel+'), auto' : "crosshair");
			
			_brush.on("brushend", _? peakdel : changeRegion);
		};
		svg_elem.node().integrateEnable = function (_) {
			svg_elem.classed("integrate-brush", _)
				.select(".background")
					.style("cursor", _? 'url('+cursor.addinteg+'), auto' : "crosshair");
			
			_brush.on("brushend", _? integrate : changeRegion);
		};
	
		// Register event listeners
		var dispatch_idx = +svg.attr("dispatch-index");		
		dispatcher.on("peakpickEnable.brush."+dispatch_idx, svg_elem.node().peakpickEnable);
		dispatcher.on("peakdelEnable.brush."+dispatch_idx, svg_elem.node().peakdelEnable);
		dispatcher.on("integrateEnable.brush."+dispatch_idx, svg_elem.node().integrateEnable);
		svg.attr("dispatch-index", dispatch_idx + 1);
		
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
}

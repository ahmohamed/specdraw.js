spec.d1.integrate = function(){
	var svg_elem, x, y, dispatcher;
	
	function _main(svg) {
		
		var width = svg.attr("width"),
				height = svg.attr("height");
				
		
		console.log("integ", y.range())
		var path = d3.svg.line()
			.x(function(d) { return x(d.x); })
			.y(function(d) { return y(d.y)-y.range()[0]/2; });
			
		
		svg_elem = svg.append("g")
			.attr("class", "integration")
		
		svg_elem
			.on("_regionchange", function (e) {
			})
			.on("_redraw", function(e){				
				svg_elem.selectAll("path").attr("d", path);
			})
		
		svg_elem.node().addIntegral = function (data) {			
			svg_elem.append("path")
				.attr("class", "line")
				.datum(getIntegral(data))
				.attr("d", path);
		}
		
		// Register event listeners
		var dispatch_idx = +d3.select(".all-panels").attr("dispatch-index");
		dispatcher.on("redraw.integ."+dispatch_idx, svg_elem.on("_redraw"));
		d3.select(".all-panels").attr("dispatch-index", dispatch_idx + 1);
		
		return svg_elem;						
	}
	
	function getIntegral(data){
		var _cumsum = cumsum(data.map(function(d) { return d.y; }));
		
		var ret = data.map(function(d,i){
			return {x:d.x, y:_cumsum[i]/100};
		});	
		return ret;
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

spec.d1.scaleBrush = function(){
	var svg_elem, axisorient, x, y, dispatcher,brushscale;
	
	function _main(svg) {
		var mainscale = x? x : y;
		brushscale = x? x.copy() : y.copy();
		axisorient = x? "bottom": "top";
		
    var axis = d3.svg.axis().scale(brushscale).orient(axisorient)
			.tickFormat(d3.format("s"));;
    
    var _brush = d3.svg.brush()
      .x(brushscale)
			.on("brushend", function () {//test x or y domain?
				var extent = _brush.empty()? brushscale.domain() : _brush.extent().reverse();
				extent = extent.sort(brushscale.domain()[0] > brushscale.domain()[1]?
					d3.descending : d3.ascending );
				
				svg.on("_regionchange")( x ? {xdomain:extent}	: {ydomain:extent} );
			})
		
		svg_elem = svg.append("g")
			.attr("class", "scale-brush")
			.attr("transform", x? "translate(0," + -20 + ")"
				: "translate(-20," + 0 + ")rotate("+90+")"
			);

    svg_elem.append("g")
	    .call(axis)
			.attr("class", "brush-axis")
    
        
		svg_elem.append("g")
      .attr("class", "brush")
      .call(_brush)
      .selectAll("rect")
        .attr("y", -5)
        .attr("height", 10);
		
						
		svg_elem.select(".background")
			.style('pointer-events', 'all');
	
		
		svg_elem
			.on("_rangechange", function(e){
				if(e.x || (e.y && y)){
					brushscale.domain( x? e.x : e.y);					
					
					svg_elem.select(".brush-axis").call(axis);
					svg_elem.select(".brush").call(_brush);					
				}
			})
			.on("_regionchange", function(e){
				if(e.xdomain || (e.ydomain && y)){
					var domain = process_domains(mainscale.domain(), brushscale.domain())
					_brush.extent(domain);
				}
			})
			.on("_redraw", function(e){
				if(e.x || (e.y && y))
					svg_elem.select(".brush").call(_brush);				
			});
		
		// Register event listeners
		var dispatch_idx = +d3.select(".all-panels").attr("dispatch-index");
		dispatcher.on("rangechange.scalebrush."+dispatch_idx, svg_elem.on("_rangechange"));
		dispatcher.on("regionchange.scalebrush."+dispatch_idx, svg_elem.on("_regionchange"));
		dispatcher.on("redraw.scalebrush."+dispatch_idx, svg_elem.on("_redraw"));		
		d3.select(".all-panels").attr("dispatch-index", dispatch_idx + 1);
		
		
		return svg_elem;									
	}
	
	function process_domains(main, brush) {
		var domain = [0,0];
		if(main[0]>main[1]){
			domain[0] = Math.min(main[0], brush[0]);
			domain[1] = Math.max(main[1], brush[1]);
		}else{
			domain[0] = Math.max(main[0], brush[0]);
			domain[1] = Math.min(main[1], brush[1]);
		}
		
		if(domain.join()==brush.join())
			domain = [0,0];
		
		return domain;
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

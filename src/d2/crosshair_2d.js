spec.d2.crosshair = function(){
	var svg_elem, x, y, dispatcher;
	
	function _main(svg) {		
		var tip = d3.tip()
		  .attr('class', 'crosshair tooltip')
			.direction('ne')
		  .offset([0, 0])
			.bootstrap(true);
		
		//var i_scale = x.copy();
		var line_idx = 0; //TODO: imp for datasets
		
		svg_elem = svg.append("g")
			.classed("crosshair clr" + line_idx, true)
			.datum(null).call(tip);

		var crosslines = svg_elem.append("g")
			.attr("class", "crosshair line");
		
		crosslines.append("path")
			.attr("class", "crosshair line x")
			.attr('d', d3.svg.line()(
				[[-x.range()[1], 0], [x.range()[1], 0]]
			));
		
		crosslines.append("path")
			.attr("class", "crosshair line y")
			.attr('d', d3.svg.line()(
				[[0, -y.range()[0]], [0, y.range()[0]]]
			));
		
		var cross_circle = svg_elem.append("circle")
			.attr("r", 4.5)

			/*			.on("click",function(){
							svg.toggleClass("selected");
						})
			*/ //TODO: select / highlight spectrum from dataset.

		svg_elem.append("text")
			.attr("x", 9)
			.attr("dy", "-1em");
			
		svg_elem
			.on("_regionchange", function(e){
					svg_elem.datum(null);
					svg_elem.attr("transform", "translate(" + (-10000) + "," + (-10000) + ")");
			})
			.on("_mousemove", function(e){
				var data_point = [x.invert(e.xcoor), y.invert(e.ycoor)]
					
				tip.text(
					d3.round(data_point[0],3) + ', ' + d3.round(data_point[1],3)
				).show(cross_circle.node());
				//d3.selectAll('.tooltip').style('pointer-events', 'none');
				
				svg_elem.datum(data_point);				
				svg_elem.attr("transform", "translate(" + e.xcoor + "," + e.ycoor + ")");
				/*svg_elem.select("text").text(
					d3.round(data_point[0],3) + ',' + d3.round(data_point[1],3)
				);*/				
			});
		
		
		svg_elem.node().show = function (_) {
			if (!arguments.length) return !(svg_elem.style("display")==="none");			
			svg_elem.style("display", _? null : "none");
			
			if(_) { tip.show(svg_elem); }
			else{tip.hide()}
			
			dispatcher.on("mousemove.line."+dispatch_idx, 
				_? svg_elem.on("_mousemove") : null);
		};
	
		svg_elem.node().enable = function (_) {
			if (!arguments.length) return params.crosshair;
			if (_){
				dispatcher.on("mouseenter.line."+dispatch_idx, function(){svg_elem.node().show(true)});
				dispatcher.on("mouseleave.line."+dispatch_idx, function(){svg_elem.node().show(false)});		
			}
			else{
				dispatcher.on("mouseenter.line."+dispatch_idx, null);
				dispatcher.on("mouseleave.line."+dispatch_idx, null);		
			}
			svg_elem.node().show(_);
		};
		/*
		svg_elem.node().i = function (_) {
			if (!arguments.length) return svg_elem.attr("i_pos");
			svg_elem.attr("i_pos", i);
			svg_elem.datum(data[i]);
		};*/
		svg_elem.node().remove = function () {
			dispatcher.on("regionchange.line."+dispatch_idx, null);
			dispatcher.on("mouseenter.line."+dispatch_idx, null);
			dispatcher.on("mouseleave.line."+dispatch_idx, null);
			dispatcher.on("mousemove.line."+dispatch_idx, null);	
			dispatcher.on("crosshairEnable.line."+dispatch_idx, null);
			data = null;
			svg_elem.remove();			
		};
		
		// Register event listeners
		var dispatch_idx = ++dispatcher.idx;
		dispatcher.on("regionchange.line."+dispatch_idx, svg_elem.on("_regionchange"));
		dispatcher.on("mouseenter.line."+dispatch_idx, function(){svg_elem.node().show(true)});
		dispatcher.on("mouseleave.line."+dispatch_idx, function(){svg_elem.node().show(false)});
		dispatcher.on("mousemove.line."+dispatch_idx, svg_elem.on("_mousemove"));	
		dispatcher.on("crosshairEnable.line."+dispatch_idx, svg_elem.node().enable);

		
		return svg_elem;									
	}
	
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

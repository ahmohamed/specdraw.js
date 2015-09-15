spec.d1.integrate = function(){
	var integ_container, x, y, dispatcher;
	
	function _main(svg) {			
		function integral_elem(integ_data, integ_value){
			var path_elem, text_elem;
			return function(svg){
				var svg_elem = svg.append("g");
				
				path_elem = svg.append("path")
					.attr("class", "line")
					.datum(integ_data);
				
				var text_g = svg.append("g")
					.attr("class", "integration-text");
					
				var text_rect = text_g.append("rect")
				
				text_elem = text_g.append("text")
					.datum(integ_value)
					.text((integ_value/integration_factor).toFixed(2))
					.on("focus", function(){})
					.on("blur", function(){})
				
				var bbox = text_elem.node().getBBox();
				text_elem.attr("dx", -bbox.width/2)
					.attr("dy", bbox.height/2);
				
				text_rect.attr("width", bbox.width +4)
					.attr("height", bbox.height +4)				
					.attr("x", bbox.x -2)
					.attr("y", bbox.y -2);
				
				var modals = require('./src/modals');
				
				text_g.on("mouseenter", function () {
					text_rect.classed("highlight", true);
					path_elem.classed("highlight", true);
				})
				.on("mouseleave", function () {
					text_rect.classed("highlight", false);
					path_elem.classed("highlight", false);
				})
				.on("contextmenu", d3.contextMenu(
				  [{
		 				title: 'Set integral',
		 				action: modals.input("Set Integral to: ",
							text_elem.text(),
		 					function (input) {
								integration_factor = text_elem.datum()/input;
								dispatcher.integ_refactor();
		 					}
		 				),
		 			}]
				));
			
				
				svg_elem.on("_redraw", function () {
					path_elem.attr("d", path);
					var mid_p = path_elem.node()
						.getPointAtLength(0.5 * path_elem.node().getTotalLength());
					
					text_g.attr("transform", "translate("+ mid_p.x +","+ mid_p.y +")");
					
					var bbox = text_elem.node().getBBox();
					text_rect.attr("width", bbox.width +2)
						.attr("height", bbox.height +2)				
						.attr("x", bbox.x -1)
						.attr("y", bbox.y -1);
				})
				.on("_refactor", function () {
					text_elem.text((integ_value/integration_factor).toFixed(2));
					var bbox = text_elem.node().getBBox();
					text_elem.attr("dx", -bbox.width/2);
					svg_elem.on("_redraw")();
				});
				
				// Register event listeners
				var dispatch_idx = ++dispatcher.idx;
				dispatcher.on("redraw.integ."+dispatch_idx, svg_elem.on("_redraw"));
				dispatcher.on("integ_refactor."+dispatch_idx, svg_elem.on("_refactor"));
			};
		}
		
		var width = svg.attr("width"),
				height = svg.attr("height");
		
		var reduction_factor = 20;
		var integration_factor;
		
		var path = d3.svg.line()
			.x(function(d) { return x(d.x); })
			.y(function(d) { return y(d.y/reduction_factor)-y.range()[0]/2; });
			
		
		integ_container = svg.append("g")
			.attr("class", "integration")
		
		integ_container.node().addIntegral = function (data) {
			var integ_data = getIntegral(data);
			var integ_value = integ_data[integ_data.length-1].y;
			
			if(!integration_factor)
				integration_factor = integ_value;
			
			integ_container.call(integral_elem(integ_data, integ_value));
		};
		
		return integ_container;						
	}
	
	function getIntegral(data){
		var _cumsum = data.map(function(d) { return d.y; }).cumsum();
		
		var ret = data.map(function(d,i){
			return {x:d.x, y:_cumsum[i]};
		});	
		return ret;
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

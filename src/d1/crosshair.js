spec.d1.crosshair = function(){
	var svg_elem, x, y, data, dispatcher;
	
	function _main(svg) {
		var i_scale = x.copy();
		
		svg_elem = svg.append("g")
			.attr("class", "crosshair")
			.style("display", "none")
			.datum(null);

		svg_elem.append("circle")
			.attr("r", 4.5)
			.on("click",function(){alert("any")});

		svg_elem.append("text")
			.attr("x", 9)
			.attr("dy", "-1em");
			
		svg_elem
			.on("_regionchange", function(e){
				if(e.x){					
					svg_elem.datum(null);
					svg_elem.attr("transform", "translate(" + (-1000) + "," + (-1000) + ")");
				}else{
					var datum = svg_elem.datum();
					if(datum)
						svg_elem.attr("transform", "translate(" + x(datum.x) + "," + y(datum.y) + ")");					
				}
			})
			.on("_mousemove", function(e){
        var i;
      
        if(e.shiftKey){
          var s_window = [Math.floor(i_scale.invert(e.xcoor-10)),
            Math.floor(i_scale.invert(e.xcoor+10))];

          i = s_window[0] + whichMax( data.slice(s_window[0],s_window[1]+1));
        }else{
          i = Math.floor(i_scale.invert(e.xcoor));					
        }
      
        if(typeof data[i] === 'undefined'){
					svg_elem.attr("i_pos", null);
					svg_elem.datum(null);
					return;
				}
				
				svg_elem.attr("i_pos", i);			
				svg_elem.datum(data[i]);
				
				svg_elem.attr("transform", "translate(" + x(data[i].x) + "," + y(data[i].y) + ")");
				svg_elem.select("text").text(d3.round(data[i].x,3));				
			});
		
		
		
		svg_elem.node().dataSlice = function (_) {
			if (!arguments.length) return i_scale.domain();
			i_scale.domain(_);
		};
	
		svg_elem.node().show = function (_) {
			if (!arguments.length) return !(svg_elem.style("display")==="none");			
			svg_elem.style("display", _? null : "none");
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
		
		// Register event listeners
		var dispatch_idx = +d3.select(".all-panels").attr("dispatch-index");
		dispatcher.on("regionchange.line."+dispatch_idx, svg_elem.on("_regionchange"));
		dispatcher.on("mouseenter.line."+dispatch_idx, function(){svg_elem.node().show(true)});
		dispatcher.on("mouseleave.line."+dispatch_idx, function(){svg_elem.node().show(false)});
		dispatcher.on("mousemove.line."+dispatch_idx, svg_elem.on("_mousemove"));	
		dispatcher.on("crosshairEnable.line."+dispatch_idx, svg_elem.node().enable);
		d3.select(".all-panels").attr("dispatch-index", dispatch_idx +1);	
		
		return svg_elem;									
	}
	
  _main.dispatcher = function(_){
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return _main;
  };
	
  _main.datum = function(_){
    if (!arguments.length) return data;
    data = _;
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

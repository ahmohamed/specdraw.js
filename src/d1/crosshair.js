spec.d1.crosshair = function(){
	var svg_elem, x, y, data, dispatcher;
	
	function _main(svg) {
		var getDataPoint = function (e) {
			var i;
      if(e.shiftKey){
        var s_window = [Math.floor(i_scale.invert(e.xcoor-10)),
          Math.floor(i_scale.invert(e.xcoor+10))];

        i = s_window[0] + whichMax( data.slice(s_window[0],s_window[1]+1));
      }else{
        i = Math.floor(i_scale.invert(e.xcoor));					
      }
			return i;
		};
		
		var i_scale = x.copy();
		var line_idx = d3.select(".main-focus").node().nSpecs;
		
		svg_elem = svg.append("g")
			.attr("class", "crosshair")
			.datum(null);

		svg_elem.append("circle")
			.attr("class", "clr"+ line_idx)
			.attr("r", 4.5)
			.on("click",function(){
				svg.toggleClass("selected");
			})
			.on("mouseenter",function(){svg.classed("highlighted",true)})
			.on("mouseleave",function(){svg.classed("highlighted",false)});

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
        var i = getDataPoint(e);
      
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
		svg_elem.node().i = function (_) {
			if (!arguments.length) return svg_elem.attr("i_pos");
			svg_elem.attr("i_pos", i);
			svg_elem.datum(data[i]);
		};
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
		var dispatch_idx = ++d3.select(".main-focus").node().dispatch_idx;
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

spec.d2.spec2d = function () {
	var data, x, y, s_id, dispatcher, range={}, svg_elem, hasCrosshair = true;
	
	function _main(svg) {
		var _crosshair, segments = [], scale_factor = 1;
		
		var width = svg.attr("width"),
				height = svg.attr("height");
		
		svg_elem = svg.append("g")
			.attr("class", "spec-img")

		var img_elem = svg_elem.append("g")
			.attr("clip-path","url(#clip)")
			.attr("filter", "url(#2dColorFilter)")
			.append("svg:image")
			  .attr('width', width)
			  .attr('height', height)
			  .attr('xlink:href', "data:image/ png;base64," + data)
			  .attr("preserveAspectRatio", "none");
				

			
		range
		svg_elem.node().range = range;
		
		/*** TODO: 2D dataset vis *****
		
		var line_idx = d3.select(".main-focus").node().nSpecs;
		var path_elem = svg_elem.append("path")
      .datum(data)
			.attr("class", "line clr"+ line_idx)
		
		******************************/
		
		/*if(hasCrosshair)
			_crosshair = (spec.d1.crosshair() 
				.datum(data)
				.xScale(x)
				.yScale(y)
				.dispatcher(dispatcher)
			)(svg_elem);
		*/
		// TODO: 2D integration
		
		svg_elem
			.on("_redraw", function(e){				
				console.log("scale & range: ",x, range.x)
				var orignial_xscale = x.copy().domain(range.x),
					orignial_yscale = y.copy().domain(range.y);
			
				//zooming on 2d picture by first translating, then scaling.
				var translate_coor = [-Math.min(orignial_xscale(x.domain()[1]), orignial_xscale(x.domain()[0])),
					 				-Math.min(orignial_yscale(y.domain()[1]), orignial_yscale(y.domain()[0]) )];
		
				var	scale_coor = [ Math.abs((range.x[0]-range.x[1])/(x.domain()[0]-x.domain()[1])),
								   Math.abs((range.y[0]-range.y[1])/(y.domain()[0]-y.domain()[1]))];

				img_elem.attr("transform","scale("+scale_coor+")"+"translate("+ translate_coor +")");
			})
			.on("_regionchange", function(e){				
			})
			.on("_integrate", function(e){
			})
			.on("_segment", function (e) {
			});
		
		// Register event listeners
		var dispatch_idx = ++d3.select(".main-focus").node().dispatch_idx;
		dispatcher.on("regionchange.line."+dispatch_idx, svg_elem.on("_regionchange"));
		dispatcher.on("redraw.line."+dispatch_idx, svg_elem.on("_redraw"));
		//dispatcher.on("integrate.line."+dispatch_idx, svg_elem.on("_integrate"));
		
		svg_elem.node().specData = function () { return data;	};
		svg_elem.node().setData = function (_) {
			data = _;
			img_elem.attr('xlink:href', "data:image/ png;base64," + data)
			svg_elem.on("_redraw")();
		};
		svg_elem.node().specRange = function () { return range;	};
		svg_elem.node().s_id = function () { return s_id;	};
		svg_elem.node().setScaleFactor = function (_) {
			if (!arguments.length) return scale_factor;
			scale_factor = _;
			svg_elem.on("_redraw")({y:true});
		};
		
		svg_elem.node().remove = function () {
			dispatcher.on("regionchange.line."+dispatch_idx, null);
			dispatcher.on("redraw.line."+dispatch_idx, null);
			//dispatcher.on("integrate.line."+dispatch_idx, null);
			data = null;
			/*if(hasCrosshair)
				_crosshair.node().remove();*/
			svg_elem.remove();
		};
		
		return svg_elem;									
	}
	
  _main.datum = function(_){
    if (!arguments.length) return data;		
		data = _;
		return _main;
  };
  _main.range = function(_){
    if (!arguments.length) return range;		
		range = _;
		return _main;
  };
  _main.dispatcher = function(_){
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return _main;
  };
  _main.crosshair = function(_){
    if (!arguments.length) return hasCrosshair;
    hasCrosshair = _;
    return _main;
  };
  _main.s_id = function(_){
    if (!arguments.length) return s_id;
    s_id = _;
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

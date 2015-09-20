module.exports = function(){
	function registerDispatcher() {
		var suff = ".line."+dispatch_idx;
		dispatcher.on("regionchange"+suff, null);
		dispatcher.on("mouseenter"+suff, null);
		dispatcher.on("mouseleave"+suff, null);
		dispatcher.on("mousemove"+suff, null);	
		
		if( enabled ){
			dispatcher.on("regionchange"+suff, svg_elem.on("_regionchange"));
			dispatcher.on("mouseenter"+suff, function(){_main.show(true);});
			dispatcher.on("mouseleave"+suff, function(){_main.show(false);});
			if ( shown ){
				dispatcher.on("mousemove"+suff, svg_elem.on("_mousemove"));	
			}
		}
		dispatcher.on("crosshairEnable"+suff, _main.enable);
	}
	
	var core = require('../elem');
	var source = core.SVGElem().class('crosshair');
	core.inherit(_main, source);
	
	var svg_elem, x, y, dispatcher, dispatch_idx;
	var enabled, shown;
	var tip = d3.tip()
	  .attr('class', 'crosshair tooltip')
		.direction('ne')
	  .offset([0, 0])
		.bootstrap(true);
	
	
	function _main(spec_img) {
		x = _main.xScale();
		y = _main.yScale();
		dispatcher = _main.dispatcher();
		dispatch_idx = ++dispatcher.idx;
		enabled = shown = true;
		
		svg_elem = source(spec_img)
			.classed("clr" + spec_img.lineIdx(), true)
			.datum(null).call(tip);

		var crosslines = svg_elem.append("g")
			.attr("class", "crosshair line");
		
		
		var xline = crosslines.append("path")
			.attr("class", "crosshair line x");
		
		var yline = crosslines.append("path")
			.attr("class", "crosshair line y");
		
		var cross_circle = svg_elem.append("circle")
			.attr("r", 4.5);

		//TODO: select / highlight spectrum from dataset.

		svg_elem
			.on("_regionchange", function(){
					//TODO: update coordinates
			})
			.on("_mousemove", function(e){
				var data_point = [x.invert(e.xcoor), y.invert(e.ycoor)];
				
				svg_elem.datum(data_point);
				cross_circle.attr("transform", "translate(" + e.xcoor + "," + e.ycoor + ")");
				tip.text(
					d3.round(data_point[0],2) + ', ' + d3.round(data_point[1],2)
				).show(cross_circle.node());
				
				xline.attr('d', d3.svg.line()
					( [[x.range()[0], e.ycoor], [x.range()[1], e.ycoor]] )
				);
				yline.attr('d', d3.svg.line()
					( [[e.xcoor, y.range()[0]], [e.xcoor, y.range()[1]]] )
				);
			})
			.on('remove', function () {
				_main.enabled(false);
				dispatcher.on("crosshairEnable.line."+dispatch_idx, null);
				tip.destroy();
			});
				
		registerDispatcher();
		return svg_elem;									
	}
	
	_main.show = function (_) {
		if (!arguments.length) {return shown;}
		shown = _;
		
		if (!svg_elem){return _main;}
		svg_elem.style("display", _? null : "none");
		
		if(_) { tip.show(svg_elem); }
		else{tip.hide();}
		
		registerDispatcher();
		return _main;
	};
	_main.enable = function (_) {
		if (!arguments.length) {return enabled;}
		enabled = _;
		
		return _main.show(_);
	};
	return _main;
};

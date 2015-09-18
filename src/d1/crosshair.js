module.exports = function (){
	function getDataPoint (x_point, pixel_to_i, local_max) {
		var i;
    if(local_max){
      var s_window = [ pixel_to_i( x_point-10 ), pixel_to_i( x_point+10 ) ];

      i = s_window[0] + data.slice(s_window[0],s_window[1]+1).whichMax();
    }else{
      i = pixel_to_i( x_point );					
    }
		return data[i];
	}
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
	
	var x, y, data, dispatcher;
	var svg_elem, dispatch_idx;
	var enabled, shown;
	
	var tip = d3.tip()
	  .attr('class', 'crosshair tooltip')
		.direction('ne')
	  .offset([0, 0])
		.bootstrap(true);
		
	var core = require('../elem');
	var source = core.SVGElem().class('crosshair');
	core.inherit(_main, source);
	
	function _main(spec_line) {
		x = _main.xScale();
		y = _main.yScale();
		dispatcher = _main.dispatcher();
		dispatch_idx = ++dispatcher.idx;
		enabled = shown = true;
				
		svg_elem = source(spec_line)
			.datum(null).call(tip); // I am clearing the data bound to the selection, not the Elem.
		
		svg_elem.append("circle")
			.attr("class", "clr"+ spec_line.lineIdx())
			.attr("r", 4.5)
			.on("click",function(){
				spec_line.sel().toggleClass("selected");
			})
			.on("mouseenter",function(){
				spec_line.sel().selectP('.main-focus').classed('dimmed', true);
				spec_line.sel().classed('highlighted', true);
			})
			.on("mouseleave",function(){
				spec_line.sel().selectP('.main-focus').classed('dimmed', false);
				spec_line.sel().classed('highlighted', false);
			});

		svg_elem
			.on("_regionchange", function(e){
				if(e.x){					
					svg_elem.datum(null);
					svg_elem.attr("transform", "translate(" + (-10000) + "," + (-10000) + ")");
				}else{
					var datum = svg_elem.datum();
					if(datum){
						svg_elem.attr("transform", "translate(" + x(datum.x) + "," + y(datum.y) + ")");						
					}
				}
			})
			.on("_mousemove", function(e){
        var p = getDataPoint(e.xcoor, spec_line.pixelToi, e.shiftKey);
      
        if(typeof p === 'undefined'){
					svg_elem.datum(null);
					return;
				}
				
				svg_elem.datum(p)
					.attr("transform", "translate(" + x(p.x) + "," + y(p.y) + ")");
				tip.text(d3.round(p.x,3)).show(svg_elem.node());
			})
			.on('remove', function () {
				_main.enabled(false);
				dispatcher.on("crosshairEnable.line."+dispatch_idx, null);
				data = null;
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
  _main.datum = function(_){
    if (!arguments.length) {return data;}
    data = _;
    return _main;
  };
	return _main;
};

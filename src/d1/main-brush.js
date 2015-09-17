module.exports = function (){
	var x, y, dispatcher;
	var svg_elem, _brush;
	var core = require('../elem');
	var source = core.SVGElem().class('main-brush');
	core.inherit(MainBrush, source);
	
	function makeBrushEvent() {
		if (_brush.empty()){
			if(x && y) {_brush.extent([[0,0],[0,0]]);}
			else{ _brush.extent([0,0]); }
			
			svg_elem.call(_brush);
			return null;
  	}
		var e = {};
		if(x && y){
			e.xdomain = [_brush.extent()[1][0], _brush.extent()[0][0]];
			e.ydomain = [_brush.extent()[1][1], _brush.extent()[0][1]];				
		}else{
			e.xdomain = x? _brush.extent().reverse():null;
			e.ydomain = y? _brush.extent():null;
		}		
		
		_brush.clear();				
		svg_elem.call(_brush);
		return e;
	}
	function changeRegion () {			
		var e = makeBrushEvent();
		if(e)
			{MainBrush.parent().changeRegion(e);}
  }		
	function peakdel () {
		var e = makeBrushEvent();
		if(e)
			{dispatcher.peakdel(e);}
  }
	function integrate () {
		var e = makeBrushEvent();
		if(e)
			{dispatcher.integrate(e);}
  }
	function peakpick() {
		_brush.clear();
		svg_elem.call(_brush);
	}
	
	function MainBrush(spec_container) {		
		x = MainBrush.xScale();
		y = MainBrush.yScale();
		dispatcher = MainBrush.dispatcher();
		
		
	  _brush = d3.svg.brush()
			.x(x)
			.y(y)
	    .on("brushend", changeRegion);
		
		svg_elem = source(spec_container)
			.call(_brush);

		svg_elem.selectAll("rect")
			.attr("height", spec_container.height());
		
		svg_elem.select(".background")
			.style('cursor', null)
			.style('pointer-events', 'all');
		
		svg_elem.on('peakpickEnable', function (_) {
			svg_elem.classed("peakpick-brush", _);
			MainBrush.parent().sel().classed("peakpick-brush", _);
			
			_brush.on("brushend", _? peakpick : changeRegion);
		})
		.on('peakdelEnable', function (_) {
			svg_elem.classed("peakdel-brush", _);
			MainBrush.parent().sel().classed("peakdel-brush", _);
			
			_brush.on("brushend", _? peakdel : changeRegion);
		})
		.on('integrateEnable', function (_) {
			svg_elem.classed("integrate-brush", _);
			MainBrush.parent().sel().classed("integrate-brush", _);
			
			_brush.on("brushend", _? integrate : changeRegion);
		});
	
		// Register event listeners
		var dispatch_idx = ++dispatcher.idx;		
		dispatcher.on("peakpickEnable.brush."+dispatch_idx, svg_elem.on('peakpickEnable'));
		dispatcher.on("peakdelEnable.brush."+dispatch_idx, svg_elem.on('peakdelEnable'));
		dispatcher.on("integrateEnable.brush."+dispatch_idx, svg_elem.on('integrateEnable'));
		
		return svg_elem;									
	}

	return MainBrush;
};

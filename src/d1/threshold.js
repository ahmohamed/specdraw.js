module.exports = function () {
	var svg_elem, x, y, dispatcher;
	var core = require('../elem');
	var source = core.ResponsiveElem('path').class('threshold line x');
	core.inherit(_main, source);
		
	function _main(spec_container, callback) {
		x = _main.xScale() || spec_container.xScale();
		y = _main.yScale() || spec_container.yScale();
		dispatcher = _main.dispatcher() || spec_container.dispatcher();
		
		svg_elem = source(spec_container)
			.on("_mousemove", function(e) {
				svg_elem.attr("d", d3.svg.line()([[x.range()[0], e.ycoor], [x.range()[1], e.ycoor]]));
			})
			.on("_click", function (e) {
				callback(y.invert(e.ycoor));
				svg_elem.remove();
				dispatcher.on("mousemove.thresh."+dispatch_idx, null);	
				dispatcher.on("click.thresh."+dispatch_idx, null);
			});
		
		var dispatch_idx = ++dispatcher.idx;
		dispatcher.on("mousemove.thresh."+dispatch_idx, svg_elem.on("_mousemove"));	
		dispatcher.on("click.thresh."+dispatch_idx, svg_elem.on("_click"));
	}

	return _main;	
};
module.exports = function () {
	var core = require('./src/elem');
	var source = core.ResponsiveElem('path');
	core.inherit(PathElem, source);
	
	
	var data;	//initiailized by parent at generation
	var x, y;								//initiailized by parent at rendering
	var range={}, svg_elem;		//initialized by self at rendering
	var data_resample, simplify_val, path_fun;
	
	function PathElem(spec_line) {
		x = PathElem.xScale();
		y = PathElem.yScale();
	
		path_fun = d3.svg.line()
			.interpolate('linear')
			.x(function(d) { return d.x; })
			.y(function(d) { return d.y; });
		
		svg_elem = source(spec_line);
		return svg_elem;			
	}
	function update_range() {
		range.x = [data_resample[0].x, data_resample[data_resample - 1].x];
		range.y = d3.extent(data_resample.map(function (d) { return d.y; }));
		
		range.x = range.x.map(x.invert);
		range.y = range.y.map(y.invert);
	}
	PathElem.redraw = function () {
		if ( !svg_elem ){return PathElem;}
		svg_elem.attr("d", path_fun);
		return PathElem;
	};
	PathElem.update = function () {
		if ( !svg_elem ){return PathElem;}
		
		data_resample = data.map(function (d) { return {x:x(d.x), y:y(d.y)};	});
		if(simplify_val){
			data_resample = require('simplify')(data_resample, simplify_val);
		}
		
		svg_elem.datum(data_resample);
		update_range();
		return PathElem;
	};
	PathElem.range = function () {
		return range;
	};
	PathElem.datum = function (_) {
		if (!arguments.length) {return data;}
		data = _;
		
		return PathElem.update();
	};
	PathElem.simplify = function (_) {
		if (!arguments.length) {return data;}
		simplify_val = _;
		return PathElem;
	};
	
	
	return PathElem;
};

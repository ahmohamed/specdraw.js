module.exports = function () {
	var simplify = require('../utils/simplify-line');
	var core = require('../elem');
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
			.x(function(d) { return x(d.x); })
			.y(function(d) { return y(d.y); });
		
		svg_elem = source(spec_line);
		return svg_elem;			
	}
	function update_range() {
		range.x = [data_resample[0].x, data_resample[data_resample.length - 1].x];
		range.y = d3.extent(data_resample.map(function (d) { return d.y; }));
	}
	PathElem.redraw = function () {
		if ( !svg_elem ){return PathElem;}
		svg_elem.attr("d", path_fun);
		return PathElem;
	};
	PathElem.update = function () {
		if ( !svg_elem ){return PathElem;}
		
		if(simplify_val){
			data_resample = simplify(data, x, simplify_val);
			console.log('simplify', data_resample.length);
		}else{
			data_resample = data;
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
		if (!arguments.length) {return simplify_val;}
		simplify_val = _;
		return PathElem;
	};
	
	
	return PathElem;
};

function peakLine(line_x, line_y, label_x){
	var bottom = Math.max(line_y - 10, 60);
	return d3.svg.line()
		.defined(function(d) { return !isNaN(d[1]); })
		([
		[label_x, 40], 
		[line_x, 60],
		[line_x, 80],
		[NaN, NaN],
		[line_x, bottom - 10],
		[line_x, bottom]
		]);
}

function adjust_peak_positions(_peaks, text_width, container_width) {
	var tw = text_width;
	var current_pos = container_width - tw;
	//console.log('start', container_width, tw, _peaks);
	for (var i = 0; i < _peaks.length; i++) {
		//console.log(_peaks[i].d.x, _peaks[i].pos, current_pos );
		if(_peaks[i].pos > current_pos){
			_peaks[i].pos = current_pos;
		}
		current_pos = _peaks[i].pos - tw;
	}
	
	if(current_pos < tw){ // if the rightmost peak is out of canvas.
		current_pos = tw;
		for (i = _peaks.length - 1; i >= 0; i--) {
			if( _peaks[i].pos < current_pos ){
				_peaks[i].pos = current_pos;
				current_pos = _peaks[i].pos + tw;
			}else{
				break;
			}
		}
	}
	return _peaks;		
}

function getPeaks(spec_container) {
	var spectra = spec_container.spectra();
	var x = spec_container.xScale();
	var all_peaks = [];
	for (var i = 0; i < spectra.length; i++) {
		var p = spectra[i].peaks(true).map(function (d) {
			return {line:i, pos:x(d.x), d:d};
		});
		all_peaks = all_peaks.concat(p);
	}
	all_peaks = all_peaks.sort(function (a, b) {
		return d3.descending(a.pos, b.pos);
	});
	return all_peaks;
}

module.exports = function(){
	var menu = [
		{
			title: 'Delete peak',
			action: function(elm, d) {
				_main.parent().spectra().filter(function (s) {
						return s.lineIdx() === d.line;
					})[0]
					.delPeaks([d.d.x, d.d.x]);
				dispatcher.peakpick();
			}
		}
	];
	function update_text() {
		var peak_text = svg_elem.selectAll("text")
			.data(_peaks);

		peak_text.enter()
			.append("text")
			.attr("dy", "0.35em")
			.attr("focusable", true)
			.on("focus", function(){});

		peak_text.exit().remove();
	}

	function update_lines() {
		var peak_line = svg_elem.selectAll("path")
			.data(_peaks);

		peak_line.enter()
			.append("path")
			.style("fill", "none");	
	
		peak_line.exit().remove();
	}

	function redraw_text() {
		svg_elem.selectAll("text").text(function(d){return d3.round(d.d.x ,3);})
			.attr("transform", function (d) {
				return "translate(" + d.pos + ",0)rotate(90)";
			})
			.attr('class', function (d) {
				return 'peak-text clr' + d.line;	
			})
			.on("keydown", function(d) {
				if(d3.event.keyCode===68){
					dispatcher.peakdel({xdomain:[d.d.x, d.d.x]});
				}
			})
			.on('click', d3.contextMenu(menu));
	}

	function redraw_lines() {		  
		svg_elem.selectAll("path")
			.attr("d", function(d){return peakLine( x(d.d.x), y(d.d.y), d.pos );})
			.attr('class', function (d) {
				return 'peak-line clr' + d.line;	
			});
	}
	
	function get_text_width() {
		var dummy_elem = svg_elem.append("text").text('any');
		
		// Using heigth because text will be rotated.
		var text_width = dummy_elem.node().getBBox().height;
		dummy_elem.remove();
		return text_width;		
	}
	
	var svg_elem, x, y, dispatcher;
	var _peaks = [];
	
	var core = require('../elem');
	var source = core.SVGElem().class('peaks');
	core.inherit(_main, source);
	
	function _main(spec_container) {

		x = _main.xScale();
		y = _main.yScale();
		dispatcher = _main.dispatcher();
		
		var width = spec_container.width();
		svg_elem = source(spec_container);
		
		
		svg_elem
			.on("_click", function(e){
				var spectra = spec_container.spectra();
				
				spectra.forEach(function (s) {
					if(s.crosshair()){ // If there is a crosshair, get its current data. 
						s.crosshair().sel().on("_mousemove")(e);
						var p = s.crosshair().sel().datum();
						if(p){
							console.log(p, s.ppmToi(p.x));
							s.addPeaks( s.ppmToi(p.x) );
						}
					}else{
						s.addPeaks( s.pixelToi(e.xcoor) );
					}
				});
				dispatcher.peakpick();
			})
			.on("_regionchange", function (e) {
				if(e.xdomain){
					_peaks = getPeaks(spec_container);
					_peaks = adjust_peak_positions(_peaks, get_text_width(), width);
				}
			})
			.on("_redraw", function(e){
				if(e.x){
					update_text();
					update_lines();					
				}
				if (_peaks.length === 0){return;}
				redraw_text();
				redraw_lines();
			})
			.on("_peakpick", function () {
				svg_elem.on("_regionchange")({xdomain:true});
				svg_elem.on("_redraw")({x:true, y:true});
			})
			.on("_peakdel", function (e) {
				if(e.xdomain){
					spec_container.spectra().forEach(function (s) {
						s.delPeaks(e.xdomain);
					});
				}
				if(e.ydomain){
					//TODO: delete peaks based on y-coordinates
				}
				dispatcher.peakpick();
			});
		
		// Register event listeners
		var dispatch_idx = ++dispatcher.idx;
		dispatcher.on("regionchange.peaks."+dispatch_idx, svg_elem.on("_regionchange"));
		dispatcher.on("redraw.peaks."+dispatch_idx, svg_elem.on("_redraw"));		
		dispatcher.on("peakpickEnable.peaks."+dispatch_idx, function (_) {
				dispatcher.on("click.peaks."+dispatch_idx, 
					_? svg_elem.on("_click"): null);
		});
		
		dispatcher.on("peakpick.peaks."+dispatch_idx, svg_elem.on("_peakpick"));
		dispatcher.on("peakdel.peaks."+dispatch_idx, svg_elem.on("_peakdel"));
		
		return svg_elem;						
	}
	
	_main.peaks = function () {
		return getPeaks(_main.parent());
	};
		
	return _main;
};

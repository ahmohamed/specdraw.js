spec.d1.pp = function(){
	var svg_elem, x, y, dispatcher;
	
	function _main(svg) {
		var width = svg.attr("width"),
				height = svg.attr("height");
		
		var _peaks = [], _peaks_vis = [];
		
		svg_elem = svg.append("g")
			.attr("class", "peaks")
		
		svg_elem
			.on("_regionchange", function (e) {
				if(e.xdomain){
					var domain = (x.domain()).sort(d3.descending)
					_peaks_vis = _peaks.filter(function(el){
						return el[0] < domain[0] && el[0] > domain[1];
					});
				}
			})
			.on("_redraw", function(e){ // TODO: redraw on x only!!				
				var peak_text = svg_elem.selectAll("text")
					.data(_peaks_vis)
				
				peak_text.enter()
					.append("text")
						.text(function(d){return d3.round(d[0] ,3);})
						.attr("dy", "0.35em")
						.attr("focusable", true)
						.on("focus", function(){})
						.on("keydown", function(d) {
							if(d3.event.keyCode===68){
								dispatcher.peakdel({xdomain:[d[0], d[0]]});
							}
						});
				
				
				peak_text.exit().remove();
				
				var peak_line = svg_elem.selectAll(".peak-line")
					.data(_peaks_vis)
				
				peak_line.enter()
					.append("path")
					.attr("class", "peak-line")
					.style("stroke", "black")
					.style("fill", "none");	
				
				peak_line.exit().remove();
				
				if(_peaks_vis.length === 0)
					return;
				
				// visualize the rest of the peaks
				var current_x;
				var labels_x = [];
				var text_width = svg_elem.select("text")
					.node().getBBox().height; //prevent overlap of peak labels.
		
				svg_elem.selectAll("text")
					.sort( function(a,b){return d3.ascending(a[0], b[0]);} )
					.text(function(d){return d3.round(d[0] ,3);})
					.attr("transform",function(d,i){
						
						var this_x = x(d[0]);
						if(this_x > current_x - text_width) //prevent overlap of peak labels.
							this_x = current_x - text_width
				
						current_x = this_x;
						labels_x.push(this_x);
						return "translate(" + this_x + ",0)rotate(90)"; 
				 	});
	
				svg_elem.selectAll("path")
					.sort( function(a,b){return d3.ascending(a[0], b[0]);} )
					.attr("d", function(d,i){return peakLine(d[0],d[1],labels_x[i])});
			})
			.on("_peakpick", function (e) {
				_peaks.push([e.x, e.y]);
				_peaks_vis.push([e.x, e.y]);				
				
				svg_elem.on("_redraw")({x:true, y:true});
			})
			.on("_peakdel", function (e) {
				if(e.xdomain){
					var domain = (e.xdomain).sort(d3.descending)
					_peaks = _peaks.filter(function(el){
						return !(el[0] <= domain[0] && el[0] >= domain[1]);
					});
				}
				if(e.ydomain){
					var domain = (e.ydomain).sort(d3.descending)
					_peaks = _peaks.filter(function(el){
						return !(el[0] <= domain[0] && el[0] >= domain[1]);
					});
				}			
				svg_elem.on("_regionchange")({xdomain:x.domain(), ydomain:y.domain()});
				svg_elem.on("_redraw")({x:true, y:true});
			});
		
		// Register event listeners
		var dispatch_idx = +d3.select(".all-panels").attr("dispatch-index");
		dispatcher.on("regionchange.peaks."+dispatch_idx, svg_elem.on("_regionchange"));
		dispatcher.on("redraw.peaks."+dispatch_idx, svg_elem.on("_redraw"));		
		dispatcher.on("peakpick.peaks."+dispatch_idx, svg_elem.on("_peakpick"));
		dispatcher.on("peakdel.peaks."+dispatch_idx, svg_elem.on("_peakdel"));
		d3.select(".all-panels").attr("dispatch-index", dispatch_idx + 1);
		
		svg_elem.node().peaks = function(){return _peaks;};
		svg_elem.node().addpeaks = function(_){_peaks.push([_.x,_.y]);_peaks_vis.push([_.x,_.y]);};
		return svg_elem;						
	}
	
	function peakLine(line_x, line_y, label_x){
		return d3.svg.line()([[label_x, 40], 
													[x(line_x), 60],
													[x(line_x), Math.max(y(line_y)-5, 60) ]]);
	}	
	
  _main.dispatcher = function(_){
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return _main;
  }
	
  _main.xScale = function(_){
    if (!arguments.length) return x;
    x = _;
    return _main;
  }

  _main.yScale = function(_){
    if (!arguments.length) return y;
    y = _;
    return _main;
  }
	
	return _main;
}

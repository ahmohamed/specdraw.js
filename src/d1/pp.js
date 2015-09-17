spec.d1.pp = function(){
	var svg_elem, x, y, dispatcher;
	
	function _main(svg) {
		var menu = [
			{
				title: '\uf1f8 Delete peak',
				action: function(elm, d, i) {
					dispatcher.peakdel({xdomain:[d[0], d[0]]});
				}
			}
		];
		
		var width = svg.width(),
				height = svg.height();
		
		var _peaks = [], _peaks_vis = [], 
				cls = [], cls_vis = [];
		
		svg_elem = svg.append("g")
			.attr("class", "peaks")
		
		svg_elem
			.on("_click", function(e){
				if(!require('./src/events').crosshair)
					d3.selectAll(".crosshair").each(function(){
						d3.select(this).on("_mousemove")(e);
					});
				
				// In case of manual peak picking on multiple spectra,
				// A only the highest peak is added. 
				/*var clicked_peaks = d3.selectAll(".crosshair").data()
					.sort(function(a,b){return d3.descending(a.y, b.y)});
				
				dispatcher.peakpick(clicked_peaks[0]);*/
				svg.selectAll(".crosshair").each(function(){
					svg_elem.node().addpeaks(this.__data__, this.parentNode.line_idx);
					svg_elem.on("_regionchange")({xdomain:true});
					svg_elem.on("_redraw")({x:true, y:true});
				});	
				
			})
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
					.data(_peaks_vis);
				
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
						})
						.on("contextmenu", d3.contextMenu(menu));
						
				
				
				peak_text.exit().remove();
				
				var peak_line = svg_elem.selectAll(".peak-line")
					.data(_peaks_vis)
				
				peak_line.enter()
					.append("path")
					//.style("stroke", "black")
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
					.attr("class", function(d){return 'peak-text clr'+d[2];})
					.attr("transform",function(d,i){
						
						var this_x = x(d[0]);
						if(this_x > current_x - text_width) //prevent overlap of peak labels.
							this_x = current_x - text_width
				
						current_x = this_x;
						labels_x.push(this_x);
						return "translate(" + this_x + ",0)rotate(90)"; 
				 	})
					.append("title")
						.text("dbl Click to edit");
	
				svg_elem.selectAll("path")
					.sort( function(a,b){return d3.ascending(a[0], b[0]);} )
					.attr("class", function(d){return 'peak-line clr'+d[2];})
					.attr("d", function(d,i){return peakLine(d[0],d[1],labels_x[i])});
			})
			.on("_peakpick", function (e, line_idx) {
				this.addPeaks(e, line_idx)
				//_peaks_vis.push([e.x, e.y]);				
				svg_elem.on("_regionchange")({xdomain:true});
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
		var dispatch_idx = ++dispatcher.idx;
		dispatcher.on("regionchange.peaks."+dispatch_idx, svg_elem.on("_regionchange"));
		dispatcher.on("redraw.peaks."+dispatch_idx, svg_elem.on("_redraw"));		
		dispatcher.on("peakpickEnable.peaks."+dispatch_idx, function (_) {
				dispatcher.on("click.peaks."+dispatch_idx, 
					_? svg_elem.on("_click"): null);
		});
		
		dispatcher.on("peakpick.peaks."+dispatch_idx, svg_elem.on("_peakpick"));
		dispatcher.on("peakdel.peaks."+dispatch_idx, svg_elem.on("_peakdel"));
		
		svg_elem.node().peaks = function(){return _peaks;};
		svg_elem.node().addpeaks = function(_, line_idx){
			if(!_.x){
				for (var i = _.length - 1; i >= 0; i--) {
					this.addpeaks( _[i], line_idx );
				}
			}else{
				if(_peaks.indexOf([_.x, _.y]) == -1) //TODO:check if peak already exists.
					_peaks.push([_.x,_.y, line_idx]);
					//cls.push('clr'+line_idx);
			}
		};
		return svg_elem;						
	}
	
	function peakLine(line_x, line_y, label_x){
		var bottom = Math.max(y(line_y) - 10, 60);
		return d3.svg.line()
			.defined(function(d) { return !isNaN(d[1]); })
			([
			[label_x, 40], 
			[x(line_x), 60],
			[x(line_x), 80],
			[NaN, NaN],
			[x(line_x), bottom - 10],
			[x(line_x), bottom]
			]);
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
};

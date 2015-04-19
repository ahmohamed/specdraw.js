spec.d1.main_focus = function () {
	var focus, width, height, x, y, dispatcher, data, range = {};

	var zoomer = d3.behavior.zoom()
		.on("zoom", function () {
			/* * When a y brush is applied, the scaled region should go both up and down.*/
			var new_range = range.y[1]/zoomer.scale() - range.y[0];
			var addition = (new_range - (y.domain()[1] - y.domain()[0]))/2
		
			var new_region = [];
			if(y.domain()[0] == range.y[0]) new_region[0] = range.y[0];
			else{new_region[0] = Math.max(y.domain()[0]-addition, range.y[0]);}
			new_region[1] = new_region[0] + new_range;
		
			focus.on("_regionchange")(
				{zoom:true,	ydomain:new_region}
			);
		});
	
	function _main(all_panels) {
		focus = all_panels.append("g")
		    .attr("class", "main-focus")
		    .attr("pointer-events", "all")
				.attr("width", width)
				.attr("height", height)
				.call(zoomer)
				.on("dblclick.zoom", null)
				.on("mousedown.zoom", null);
		
		
		/****** Attach functions on svg node ********/
		focus.node().dispatch_idx =  0; // an index as a namespace for dispacther evernts.
		focus.node().nSpecs = 0;				// count how many spec-lines are displayed (used for coloring.)
		focus.node().xScale = x;
		focus.node().yScale = y;
		focus.node().range = range;
		focus.node().addPeaks = function (idx) { //TODO:move peaks to line
			focus.select(".peaks").node().addpeaks(data.subset(idx));			
			focus.select(".peaks").on("_regionchange")({xdomain:true});
			focus.select(".peaks").on("_redraw")({x:true});			
		};
		focus.node().addSpecLine = function(spec_data, crosshair){
			if(arguments.length < 2)
				crosshair = true;
			
			var elem  =spec.d1.line()
				.datum(spec_data)
				.xScale(x)
				.yScale(y)
				.crosshair(crosshair)
				.dispatcher(dispatcher)
				(focus);
			
			var x0 = d3.max(focus.selectAll(".spec-line")[0].map(function(s){return s.range.x[0]})),
					x1 = d3.min(focus.selectAll(".spec-line")[0].map(function(s){return s.range.x[1]})),
					y0 = d3.min(focus.selectAll(".spec-line")[0].map(function(s){return s.range.y[0]})),
					y1 = d3.max(focus.selectAll(".spec-line")[0].map(function(s){return s.range.y[1]}));
			
			var xdomain = x.domain(), ydomain = y.domain();
			
			focus.on("_rangechange")({x:[x0,x1], y:[y0,y1], norender: focus.node().nSpecs > 0});
			
			if(focus.node().nSpecs > 0)
				focus.on("_regionchange")({xdomain:xdomain});
			
			focus.node().nSpecs++;
			return elem;
		}
		focus.node().getThreshold = function (callback) {
			focus.call(
				spec.d1.threshold()
					.xScale(x).yScale(y)
					.dispatcher(dispatcher)
					.callback(callback)
			);	
		};
		//focus.node().getThreshold(null);
		
		/*********** Handling Events **************/
		focus
			.on("_redraw", function(e){			
				dispatcher.redraw(e);
			})
			.on("_regionchange", function(e){
				// If the change is in X
				if(e.xdomain){
					x.domain(e.xdomain);	
				}				
				dispatcher.regionchange({xdomain:e.xdomain});
							
				if(e.ydomain){
					y.domain(e.ydomain);
					if(!e.zoom) //If y domain is changed by brush, adjust zoom scale
						zoomer.scale((range.y[0]-range.y[1])/(y.domain()[0]-y.domain()[1]));
				}else{
					//modify range.y  and reset the zoom scale
					var y0 = d3.min(focus.selectAll(".spec-line")[0].map(function(s){return s.range.y[0]})),
					y1 = d3.max(focus.selectAll(".spec-line")[0].map(function(s){return s.range.y[1]}));
					range.y = [y0,y1];
					y.domain(range.y);
					dispatcher.rangechange({y:range.y});
					zoomer.scale(1);
				}
			
				dispatcher.regionchange({ydomain:y.domain()});
				focus.on("_redraw")({x:e.xdomain, y:true});
			})
			.on("_rangechange", function(e){
				if(e.x)
					range.x = e.x;
				if(e.y)
					range.y = e.y;
			
				dispatcher.rangechange(e);
				
				if(!e.norender)
					focus.on("_regionchange")({xdomain:range.x, ydomain:range.y});
			})
			.on("mouseenter", dispatcher.mouseenter)
			.on("mouseleave", dispatcher.mouseleave)
			.on("mousemove", function(e){
				var new_e = d3.event;
				new_e.xcoor = d3.mouse(this)[0];
				new_e.ycoor = d3.mouse(this)[1];
			
				dispatcher.mousemove(new_e);
			})
			.on("mousedown", function (e) {	// Why?! because no brush when cursor on path?
			  var new_click_event = new Event('mousedown');
			  new_click_event.pageX = d3.event.pageX;
			  new_click_event.clientX = d3.event.clientX;
			  new_click_event.pageY = d3.event.pageY;
			  new_click_event.clientY = d3.event.clientY;
			  focus.select(".main-brush").node()
					.dispatchEvent(new_click_event);
			})
			.on("click", function(e){
				var new_e = d3.event;
				new_e.xcoor = d3.mouse(this)[0];
				new_e.ycoor = d3.mouse(this)[1];
		
				dispatcher.click(new_e)
			})
			.on("dblclick", dispatcher.regionfull);

		dispatcher.on("regionfull",function () {
			focus.on("_regionchange")({xdomain:range.x});		
		});
			
		// overlay rectangle for mouse events to be dispatched.
		focus.append("rect")
			.attr("width", width)
			.attr("height", height)
			.style("fill", "none");

		//brushes
		focus.call(
			spec.d1.mainBrush()
				.xScale(x)
				.dispatcher(dispatcher)
		);

		//spectral lines
		focus.node().addSpecLine(data);
		
		//peak picker	
		focus.call(
			spec.d1.pp()
				.xScale(x)
				.yScale(y)
				.dispatcher(dispatcher)
		);
	}
	
  _main.datum = function(_){
    if (!arguments.length) return data;
    data = _;
    return _main;
  };
  _main.dispatcher = function(_) {
  	if (!arguments.length) return dispatcher;
  	dispatcher = _;
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
  _main.width = function(_){
    if (!arguments.length) return width;
    width = _;
    return _main;
  };
  _main.height = function(_){
    if (!arguments.length) return height;
    height = _;
    return _main;
  };
	return _main;	
};
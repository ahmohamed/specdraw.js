spec.d2.main_focus = function () {
	var focus, width, height, x, y, dispatcher, data, range = {};
	var zoomer = d3.behavior.zoom()
		.on("zoom", function (){
			/*var factor = 0.3/Math.log(30);
			var val = Math.log(zoomer.scale())*factor;		
			d3.select("#rfunc").attr("slope",0.5+val);
			d3.select("#bfunc").attr("intercept",-0.5+val);*/
			d3.select("#rfunc").attr("slope", zoomer.scale());
			d3.select("#bfunc").attr("slope", zoomer.scale());
		}).scaleExtent([0.1,100]);	
	
	function _main(slide) {
		focus = slide.append("g")
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
		focus.node().addSpec = function(spec_data, crosshair, overwrite){
			if(arguments.length < 2)
				crosshair = true;
			
			var elem;
			if(overwrite) console.log("overwrite size:", overwrite.size());
			
			if(!overwrite || overwrite.size() == 0){
				elem = spec.d2.spec2d()
					.datum(spec_data["data"])
					.xScale(x)
					.yScale(y)
					.s_id(spec_data["s_id"])
					.range({x:spec_data["x_domain"], y:spec_data["y_domain"]})
					.crosshair(crosshair)
					.dispatcher(dispatcher)
					(focus);
			}else{
				console.log("overwriting spec");
				elem = overwrite;
				elem.node().setData(spec_data['data']);
				if(spec_data['s_id']) elem.node().s_id(spec_data['s_id']);
			}
			
			var xdomain = x.domain(), ydomain = y.domain();
			
			console.log("domains: ",spec_data["x_domain"], spec_data["y_domain"])
			focus.on("_rangechange")({x:spec_data["x_domain"], y:spec_data["y_domain"], norender: focus.node().nSpecs > 0});
			
			if(focus.node().nSpecs > 0)
				focus.on("_regionchange")({xdomain:xdomain, ydomain:ydomain});
			
			focus.node().nSpecs++;
			return elem;
		};
		focus.node().addSpecLine = focus.node().addSpec;
		focus.node().nd = 2;
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
				//dispatcher.regionchange({xdomain:e.xdomain});
							
				if(e.ydomain){
					y.domain(e.ydomain);					
				}
				
				dispatcher.regionchange({xdomain:e.xdomain, ydomain:y.domain()});
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
			focus.on("_regionchange")({xdomain:range.x, ydomain:range.y});		
		});
			
		// overlay rectangle for mouse events to be dispatched.
		/*focus.append("rect")
			.attr("width", width)
			.attr("height", height)
			.style("fill", "none");
		*/
		
		focus.node().addSpec(data);
		//brushes
		focus.call(
			spec.d1.mainBrush()
				.xScale(x)
				.yScale(y)
				.dispatcher(dispatcher)
		);
    
		
		
		//peak picker	
		/*focus.call(
			spec.d1.pp()
				.xScale(x)
				.yScale(y)
				.dispatcher(dispatcher)
		);*/
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
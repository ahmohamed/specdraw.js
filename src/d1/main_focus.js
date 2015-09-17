spec.d1.main_focus = function () {
	var focus, x, y, dispatcher, data, range = {};
	var core = require('./src/elem')
	var source = core.SVGElem().class('main-focus');
	var data, slide_selection;
	var specs = core.ElemArray();
	
	/*var zoomTimer;
	var new_region;
	var stepzoom = function () {
		//console.log(new_region)
		if(new_region && (new_region[0] != range.y[0] || new_region[1] != range.y[1]))
			focus.on("_regionchange")(
				{zoom:true,	ydomain:new_region}
			);
		zoomTimer = setTimeout(stepzoom, 100);
	}*/
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

	
	function SpecContainer(slide) {
		x = SpecContainer.xScale();
		y = SpecContainer.yScale();
		dispatcher = SpecContainer.dispatcher();
		
		focus = source(slide)
	    .attr("pointer-events", "all")
			.attr('clip-path', "url(#" + slide.clipId() + ")")
			.attr("width", SpecContainer.width())
			.attr("height", SpecContainer.height())
			.call(zoomer)
			.on("dblclick.zoom", null)
			.on("mousedown.zoom", null);
		
		
		/****** Attach functions on svg node ********/
		//focus.node().dispatch_idx =  0; // an index as a namespace for dispacther events.
		//focus.node().nSpecs = 0;				// count how many spec-lines are displayed (used for coloring.)
		//focus.node().xScale = x;
		//focus.node().yScale = y;
		//focus.node().range = range;
		//focus.node().addPeaks
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
					var y_limits = (y1-y0);
					y0 = y0 - (0.05 * y_limits);
					y1 = y1 + (0.05 * y_limits);
					
					
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
			.attr("width", SpecContainer.width())
			.attr("height", SpecContainer.height())
			.style("fill", "none");

		//brushes
		focus.call(
			spec.d1.mainBrush()
				.xScale(x)
				.dispatcher(dispatcher)
		);

		//spectral lines
		for (var i = 0; i < specs.length; i++) {
			render_spec(specs[i]);
		}
		
		//peak picker	
		focus.call(
			spec.d1.pp()
				.xScale(x)
				.yScale(y)
				.dispatcher(dispatcher)
		);
	}
	function update_range() {
		var x0 = d3.max(focus.selectAll(".spec-line")[0].map(function(s){return s.range.x[0]})),
			x1 = d3.min(focus.selectAll(".spec-line")[0].map(function(s){return s.range.x[1]})),
			y0 = d3.min(focus.selectAll(".spec-line")[0].map(function(s){return s.range.y[0]})),
			y1 = d3.max(focus.selectAll(".spec-line")[0].map(function(s){return s.range.y[1]}));

			
		// Add 5% margin to top and bottom (easier visualization).
		var y_limits = (y1-y0);
		y0 = y0 - (0.05 * y_limits);
		y1 = y1 + (0.05 * y_limits);

		var xdomain = x.domain(), ydomain = y.domain();

		focus.on("_rangechange")({x:[x0,x1], y:[y0,y1], norender: specs.length > 1});

		if(specs.length > 1)
			focus.on("_regionchange")({xdomain:xdomain});	
	}
	
	function render_spec(s) {
		if(!focus){return;}
		
		s.xScale(x).yScale(y)
			.dispatcher(dispatcher)
			(SpecContainer);
				
		update_range();
	}
	
	core.inherit(SpecContainer, source);
	SpecContainer.addSpec = function(spec_data, crosshair){
		if (!arguments.length) 
			throw new Error("appendSlide: No data provided.");
		
		if(typeof crosshair === 'undefined'){
			crosshair = true;
		}
		
		// TODO: s_id is only present in 'connected' mode.
		var s_id = null;
		var spec_label = 'spec'+specs.length;
		console.log(spec_data['label'])

		if(typeof spec_data["s_id"] !== 'undefined') s_id = spec_data["s_id"];
		if(typeof spec_data['label'] !== 'undefined') spec_label = spec_data["label"];
		spec_data = spec_data["data"]
		
		// Find the spectrum with the same s_id.
		// If it is present, overwrite it.
		// Otherwise, create a new spectrum.
		var s = specs.filter(function (e) {
			return e.s_id() === s_id
		}	);
		
		if ( s.length === 0 ){
		 	s = spec.d1.line()
				.datum(spec_data)
				.crosshair(crosshair)
				.s_id(s_id);
				
			specs.push(s);
		}else{
			s = s[0];
			s.datum(spec_data);//TODO: setData!!
		}
		
		render_spec(s);
		return s;
	};
	SpecContainer.addPeaks = function (idx) { //TODO:move peaks to line
		if(!focus){return;}
		focus.select(".peaks").node().addpeaks(data.subset(idx));			
		focus.select(".peaks").on("_regionchange")({xdomain:true});
		focus.select(".peaks").on("_redraw")({x:true});			
	};
	SpecContainer.nd = function(){
		return 1;
	}
	SpecContainer.spectra = function () {
		return specs;
	};
  SpecContainer.range = function(_){
		return range;
  };
  SpecContainer.datum = function(_){
    if (!arguments.length) return data;
    data = _;
		
		//TODO: Clear all spectra first.
		SpecContainer.addSpec(_);
    return SpecContainer;
  };
	
	
	return SpecContainer;
};
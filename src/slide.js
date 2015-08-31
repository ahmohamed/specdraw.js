/*
	import 'event';
	import 'd1/main-focus';
	import 'd2/main-focus';
	import 'd1/scale-brush';
*/
spec.slide = function(){
	var data, elem, svg_width, svg_height;
	function _main(app){
		if(!data){
			create_empty_slide();//TODO
			return ;
		}
		
		var brush_margin = 20;

    var margin = {
        top: 10 + brush_margin,
        right: 40,
        bottom: 40,
        left:10 + brush_margin
    };

		var width = svg_width - margin.left - margin.right,
        height = svg_height - margin.top - margin.bottom;
		
    var x = d3.scale.linear().range([0, width]),
    y = d3.scale.linear().range([height, 0]);
  
    var xAxis = d3.svg.axis().scale(x).orient("bottom"),
        yAxis = d3.svg.axis().scale(y).orient("right")
          .tickFormat(d3.format("s"));
		
    var xGrid = d3.svg.axis().scale(x)
					.orient("bottom").innerTickSize(height)
					.tickFormat(''),
        yGrid = d3.svg.axis().scale(y)
					.orient("right").innerTickSize(width)
					.tickFormat('');
  	
		var two_d = (data["nd"] && data["nd"] === 2);
		
		// Event dispatcher to group all listeners in one place.
		var dispatcher = d3.dispatch(
			"rangechange", "regionchange", "regionfull", "redraw",  	//redrawing events
			"mouseenter", "mouseleave", "mousemove", "click", 	//mouse events
			"keyboard",																//Keyboard
			"peakpickEnable", "peakdelEnable", "peakpick", "peakdel",		//Peak picking events
			"integrateEnable", "integrate", "integ_refactor",						//Integration events
			"crosshairEnable",
			"blindregion",
			"log"
		);
		dispatcher.idx = 0;
		
		var spec_slide = app.append("svg")
			.attr({
				width:svg_width,
				height:svg_height				
			}).classed("spec-slide", true)
			.classed("active", true)
		
		var contents = spec_slide.append('g')
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		
		spec_slide.node().clip_id = guid();
    var defs = spec_slide.append("defs");
		defs.append("clipPath")
		.attr("id", spec_slide.node().clip_id)
		  .append("rect")
		    .attr("width", width)
		    .attr("height", height);

		/** PNG images are grey scale. All positive and negative values are represented as unsined 8-bit int.
				where 127 represent the zero. We want to recolor them as follows:
			 	* positive values colored with a red-orange hue.
				* negative values colored with a blue-cyan hue.
				* Zeros colored as white.
			* To do so, first copy Red component to Green and Blue.
			* Red component will take zeros upto 255/2 (127) i.e negative values. values >127 colored using red/green gradient.
			* constrast this for the blue component.
		*/
	
		if(two_d){
			var svg_filter = defs.append("filter").attr("id", "2dColorFilter");
			svg_filter.append("feColorMatrix")
				.attr("type","matrix")
				.attr("values","1 0 0 0 0	0 0 0 0 0 1 0 0 0 0 0 0 0 1 0");
	
			var fe_component_transfer = svg_filter.append("feComponentTransfer")
											.attr("color-interpolation-filters","sRGB");
	
			fe_component_transfer.append("feFuncR")
									.attr("type","linear")
									.attr("slope","-1")
									.attr("intercept","0.5");
							
			fe_component_transfer.append("feFuncB")
									.attr("type","linear")
									.attr("slope","1")
									.attr("intercept","-0.5");
	
			var fe_component_transfer = svg_filter.append("feComponentTransfer")
											.attr("color-interpolation-filters","sRGB");

			fe_component_transfer.append("feFuncR")
									.attr("id","rfunc")
									.attr("type","linear")
									.attr("slope","1");
					
			fe_component_transfer.append("feFuncB")
									.attr("id","bfunc")
									.attr("type","linear")
									.attr("slope","1");
											
			svg_filter.append("feColorMatrix")
				.attr("type","matrix")
				.attr("values","-10 0 0 0 1 -10 0 -10 0 1 0 0 -10 0 1 0 0 0 1 0");
	
		}
		/**********************************/				
		
		//axes	and their labels
		contents.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")");
			

		contents.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + width + ",0)");;
		
		contents.append("g").classed('x grid', true);
		contents.append("g").classed('y grid', true);
		
		contents.append("text")
	    .attr("class", "x label")
	    .attr("text-anchor", "middle")
	    .attr("x", width/2)
	    .attr("y", height)
			.attr("dy", "2.8em")
	    .text("Chemical shift (ppm)");
		
		contents.append("text")
	    .attr("class", "y label")
	    .attr("text-anchor", "end")
	    .attr("y", width)
	    .attr("dy", "-.75em")
	    .attr("transform", "rotate(-90)")
	    .text("Intensity");
		
		dispatcher.on("redraw.slide", function (e) {
			if(e.x){
				contents.select(".x.axis").call(xAxis);
				if(app.node().options.grid.x)
					contents.select(".x.grid").call(xGrid);
			}
			if(e.y){
				contents.select(".y.axis").call(yAxis);
				if(app.node().options.grid.y)
					contents.select(".y.grid").call(yGrid);
				
			}
		});
		
		var main_focus = two_d ? spec.d2.main_focus : spec.d1.main_focus
		//Main focus
		contents.call(
			main_focus()
				.datum(data)
				.xScale(x)
				.yScale(y)
				.width(width)
				.height(height)
				.dispatcher(dispatcher)
		);
		
		//Scale brushes
		contents.call(
			spec.d1.scaleBrush()
				.xScale(x)
				.dispatcher(dispatcher)
		);
	
		contents.call(
			spec.d1.scaleBrush()
				.yScale(y)
				.dispatcher(dispatcher)
		);
		
		spec_slide.node().nd = two_d ? 2 : 1;
		spec_slide.node().addSpec = function (_) {
			contents.select('.main-focus').node().addSpec(_);
		};
		spec_slide.node().slideDispatcher = dispatcher;
	}
	
  _main.datum = function(_){
    if (!arguments.length) return data;
    data = _;
    return _main;
  };
  _main.width = function(x){
    if (!arguments.length) return svg_width;
    svg_width = x;
    return _main;
  };

  _main.height = function(x){
    if (!arguments.length) return svg_height;
    svg_height = x;
    return _main;
  };
	return _main;
};

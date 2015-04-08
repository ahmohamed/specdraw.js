spec.d1.main = function(){
  var data, svg_width, svg_height;

  function d1main(svg){
    /* * Check variable definitions**/
    if (typeof data === 'undefined'){
        data = svg.datum();
        if (typeof data === 'undefined')
            throw new Error("nmr1d: no data provided.");
      
        svg.datum(null);    
    }
    if (typeof svg_width === 'undefined' || typeof svg_height === 'undefined'){
        svg_width = +svg.attr("width");    svg_height = +svg.attr("height");
				
        if (typeof svg_width === 'undefined' || typeof svg_height === 'undefined'
					|| isNaN(svg_width) || isNaN(svg_height))
            throw new Error("nmr1d: chart width or height not defined.");
    }
    if (svg_width < 100 || svg_height < 100){
        throw new Error("nmr1d: Canvas size too small. Width and height must be at least 100px");
    }
		
		var brush_margin = 20;

    var margin = {
        top: 10 + brush_margin,
        right: 40,
        bottom: 30,
        left:10 + brush_margin
    };
  
  
  
		var width = svg_width - margin.left - margin.right,
        height = svg_height - margin.top - margin.bottom;
	  
		applyCSS2();
		
    var x = d3.scale.linear().range([0, width]),
    y = d3.scale.linear().range([height, 0]);
  
    var xAxis = d3.svg.axis().scale(x).orient("bottom"),
        yAxis = d3.svg.axis().scale(y).orient("right")
          .tickFormat(d3.format("s"));
  
    svg.append("defs").append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("width", width)
        .attr("height", height);
  
		var all_panels = svg.append("g")
			.attr("class", "all-panels")
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		svg.call(spec.menu());
		
		/**** Keyboard events and logger ****/
		registerKeyboard();
		var div = all_panels.append("svg:foreignObject")
				.attr("class", "logger")
				.attr("pointer-events", "all")
			.append("xhtml:div")
				.style({
					"left":margin.left+"px",
					"top":margin.top+"px"
				});

		div.append("a").attr("class", "progress");

		dispatcher.on("log",function log(message) {
		    div.append("a")
		      .text(message)
		    .transition()
		      .duration(2500)
		      .style("opacity", 1e-6)
					.remove();
		});
		
		//axes	and their labels
		all_panels.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")");

		all_panels.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + width + ",0)");;
		
		all_panels.append("text")
	    .attr("class", "x label")
	    .attr("text-anchor", "middle")
	    .attr("x", width/2)
	    .attr("y", height)
			.attr("dy", "2.8em")
	    .text("Chemical shift (ppm)");
		
		all_panels.append("text")
	    .attr("class", "y label")
	    .attr("text-anchor", "end")
	    .attr("y", width)
	    .attr("dy", "-.75em")
	    .attr("transform", "rotate(-90)")
	    .text("Intensity");
		
		dispatcher.on("redraw.all_panels", function (e) {
			if(e.x)
				all_panels.select(".x.axis").call(xAxis);
			if(e.y)
				all_panels.select(".y.axis").call(yAxis);
		});
		
		
		//Main focus
		all_panels.call(spec.d1.main_focus()
			.datum(data)
			.xScale(x)
			.yScale(y)
			.width(width)
			.height(height)
			.dispatcher(dispatcher));
		
		//Scale brushes
		all_panels.call(
			spec.d1.scaleBrush()
				.xScale(x)
				.dispatcher(dispatcher)
		);
	
		all_panels.call(
			spec.d1.scaleBrush()
				.yScale(y)
				.dispatcher(dispatcher)
		);
	
		//console.log(getComputedStyle(d3.select(".spec-line").select(".line").node()));
		
		
		
		/* testing peak picker */
		/*dispatcher.peakpick(data[1000]);
		dispatcher.peakpick(data[1110]);
		dispatcher.peakpick(data[1100]);
		dispatcher.peakpick(data[1100]);
		dispatcher.peakdel({xdomain:[250, 195]});
		dispatcher.integrate({xdomain:[265, 260]});
		
		focus.select(".peaks").node().addpeaks(data[1200]);
		dispatcher.peakpick(data[1000]);*/
		
		
  }
 
  d1main.datum = function(x){
    if (!arguments.length) return data;
    data = x;
    return d1main;
  };

  d1main.width = function(x){
    if (!arguments.length) return svg_width;
    svg_width = x;
    return d1main;
  };

  d1main.height = function(x){
    if (!arguments.length) return svg_height;
    svg_height = x;
    return d1main;
  };
  return d1main;

};

spec.d1.main = function(){
  var data, data_slice, svg_width, svg_height, range={}, x, y, _peaks;
  var scale_brush;

  function d1main(svg){
    /* * Check variable definitions**/
    if (typeof data === 'undefined'){
        data = svg.datum();
        if (typeof data === 'undefined')
            throw new Error("nmr1d: no data provided.");
      
        svg.datum(null);    
    }
    if (typeof svg_width === 'undefined' || typeof svg_height === 'undefined'){
        svg_width = svg.attr("width");    svg_height = svg.attr("height");
        if (typeof svg_width === 'undefined' || typeof svg_height === 'undefined')
            throw new Error("nmr1d: chart width or height not defined.");
    }
    if (svg_width < 100 || svg_height < 100){
        throw new Error("nmr1d: Canvas size too small. Width and height must be at least 100px");
    }
		
		var brush_margin = 20;
		/*if(scale_brush.style() == "full")
			brush_margin = svg_height*0.2 -10;
		else if(scale_brush.style() == "slim")
			brush_margin = 20;
		*/		
    var margin = {
        top: 10 + brush_margin,
        right: 40,
        bottom: 20,
        left:10 + brush_margin
    };
  
  
  
		var width = svg_width - margin.left - margin.right,
        height = svg_height - margin.top - margin.bottom;
  
  
    x = d3.scale.linear().range([0, width]),
    y = d3.scale.linear().range([height, 0]);
  
    var xAxis = d3.svg.axis().scale(x).orient("bottom"),
        yAxis = d3.svg.axis().scale(y).orient("right")
          .tickFormat(d3.format("s"));
  
  
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

	
    svg.append("defs").append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("width", width)
        .attr("height", height);
  
		var all_panels = svg.append("g")
			.attr("class", "all-panels");		
		
		svg.call(spec.menu());
		
    var focus = all_panels.append("g")
        .attr("class", "main-focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("pointer-events", "all")
				.attr("width", width)
				.attr("height", height)
				.attr("dispatch-index", 0)
				.call(zoomer)
				.on("dblclick.zoom", null)
				.on("mousedown.zoom", null);
	
	
		
		
		// overlay rectangle for mouse events to be dispatched.
		focus.append("rect")
			.attr("width", width)
			.attr("height", height)
			.style("fill", "none");
			
		//axes	
		focus.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")");

		focus.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + width + ",0)");;
		
		//spectral lines
		focus.call(
			spec.d1.line()
				.datum(data)
				.xScale(x)
				.yScale(y)
				.dispatcher(dispatcher)
		);
		
		//brushes
		focus.call(
			spec.d1.mainBrush()
				.xScale(x)
				.dispatcher(dispatcher)
		);
				
		focus.call(
			spec.d1.scaleBrush()
				.xScale(x)
				.dispatcher(dispatcher)
		);
		
		focus.call(
			spec.d1.scaleBrush()
				.yScale(y)
				.dispatcher(dispatcher)
		);
			
		//peak picker	
		focus.call(
			spec.d1.pp()
				.xScale(x)
				.yScale(y)
				.dispatcher(dispatcher)
		);
		
		focus
			.on("_redraw", function(e){
				if(e.x)
					focus.select(".x.axis").call(xAxis);
				if(e.y)
					focus.select(".y.axis").call(yAxis);
				
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
					//TODO: don't attach range to datum!!
					var y0 = d3.max(focus.selectAll(".spec-line").data().map(function(d){return d.y[0]})),
					y1 = d3.min(focus.selectAll(".spec-line").data().map(function(d){return d.y[1]}));
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
				focus.on("_regionchange")({xdomain:range.x, ydomain:range.y});
			})
			.on("mouseenter", function(e){
				dispatcher.mouseenter(e);
			})
			.on("mouseleave", function(e){
				dispatcher.mouseleave(e);
			})
			.on("mousemove", function(e){
				var new_e = d3.event;
				new_e.xcoor = d3.mouse(this)[0];
				new_e.ycoor = d3.mouse(this)[1];
				
				dispatcher.mousemove(new_e);
			})
			.on("click", dispatcher.click)
			.on("dblclick", function(){
				focus.on("_regionchange")({xdomain:range.x})
			});

		  
			
		var x0 = d3.max(focus.selectAll(".spec-line").data().map(function(d){return d.x[0]})),
				x1 = d3.min(focus.selectAll(".spec-line").data().map(function(d){return d.x[1]})),
				y0 = d3.max(focus.selectAll(".spec-line").data().map(function(d){return d.y[0]})),
				y1 = d3.min(focus.selectAll(".spec-line").data().map(function(d){return d.y[1]}));
	
		
		focus.on("_rangechange")({x:[x0,x1], y:[y0,y1]});
		
		
		/* testing peak picker */
		dispatcher.peakpick(data[1000]);
		dispatcher.peakpick(data[1110]);
		dispatcher.peakpick(data[1100]);
		dispatcher.peakdel({xdomain:[250, 195]});
		dispatcher.integrate({xdomain:[265, 260]});
		
		focus.select(".peaks").node().addpeaks(data[1200]);
		dispatcher.peakpick(data[1000]);
		
		registerKeyboard(svg);
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

  d1main.brush = function(x){
    if (!arguments.length) return scale_brush;
    scale_brush = x;
    return d1main;
  };

  d1main.xScale = function(xScale){
    if (!arguments.length) return x;
    x = xScale;
    return d1main;
  };

  d1main.yScale = function(yScale){
    if (!arguments.length) return y;
    y = yScale;
    return d1main;
  };
	d1main.peak_picker = function () {
		return _peaks;
	};

  return d1main;

};

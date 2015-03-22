spec.menu = function(){
	var svg_elem, x, y, menu_on=false;
	
	function _main(svg) {
		function css_trans(transform){
		  return function(svg){
		    svg.style({
		      "transform": transform,
		      "-webkit-transform":transform,
		      "-moz-transform":transform,
		      "-o-transform":transform
		    });
		  }
		}
		function toggle() {
		  if(!menu_on){
				button.text("✖").on("click",null)
    
				d3.select(".all-panels")
					.transition().duration(500)
					.attrTween("transform",function(){
				 	return function(t){
	          nav.call(css_trans("translateX("+ (-width+t*width) + "px)"));
	          button.call(css_trans("translateY("+ t*height + "px)"));
				    return "translate(0,"+ t*height+")";
				 	}
				}).each("end", function(){
	        button.on("click", toggle);
	        menu_on = true;
	      });    
		  }else{
		    button.text("☰").on("click",null);    
		    d3.select(".all-panels")
					.transition().duration(500)
					.attrTween("transform",function(){
					 	return function(t){
		          nav.style("max-height", (height-t*height) +"px");
		          button.call(css_trans("translateY("+ (height-t*height) + "px)"));
					    return "translate(0,"+ (height-t*height) +")";
					 	}
					})
		    .each("end", function(){
		      	div_menu.style("overflow", "hidden");
		      	nav
							.style("max-height","none")
		          .call(css_trans("translate("+ (-width) + "px,0px)"));
		        button.on("click", toggle);
		        menu_on = false;
		    	});
		  }
  
		}
		
		
		var width = svg.attr("width"),
				height = 25;
	
	
		svg_elem = svg.append("g")
			.attr("class", "all-menu");

		var div_menu = svg_elem.append("svg:foreignObject")
			.attr("width", height)
			.attr("height", height)
			.style('pointer-events', 'all')
			.append("xhtml:div")
			.style({
        "width": width+"px",
				"height": height*2+"px",
				"vertical-align": "middle",
				"line-height": height+"px",
				"overflow": "hidden",
				"color": "white"
			});
			
			

		var button = div_menu.append("xhtml:a")
			.style({
				"width": height+"px",
        "text-align": "center",
				"background": "#3B3B3B",
				"float": "left",
				"color": "white",
        "text-decoration":"none"
			})			
			.attr("class", "open-menu")
		  .attr("href", "#")
			.text("☰")
			.on("click", toggle);
 

		var links =  ["This", "little", "piggy", "went", "to", "market"];

		var nav = div_menu.append("xhtml:nav")
			.attr("class", "main-nav")
			.style({
        "background": "#3B3B3B",
        "overflow-y": "hidden"
			})
    	.call(css_trans("translateX("+ (-width) + "px)"));


		nav.selectAll("a")
			.data(links)
			.enter()
			.append("a")
		  	.text(function(d){return d;})
					
		nav.append("a")
	  	.text("Crosshair")
			.on("click", events.crosshairToggle);
		
		nav.append("a")
	  	.text("Peakpick")
			.on("click", events.peakpickToggle);

		nav.append("a")
	  	.text("Peakdel")
			.on("click", events.peakdelToggle);
		
		nav.append("a")
	  	.text("integrate")
			.on("click", events.integrateToggle);
			
		nav.selectAll("a")
			.attr("href","#")
	    .style({"color": "white",
	      "padding":"0 10px",
	      "display": "inline-block"
	    })
	  	.on("mouseenter",function(){
	  		d3.select(this).style("color", "red")
	    	d3.select(this).style("background", "black")
			})
	 		.on("mouseleave",function(){
	  		d3.select(this).style("color", "white")
	      d3.select(this).style("background", "none")
			});
		
		return svg_elem;									
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

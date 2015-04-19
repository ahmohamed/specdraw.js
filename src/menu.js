spec.menu = function(){
	var svg_elem, x, y, menu_on=false;
	
	function _main(svg) {		
		function toggle() {
		  if(!menu_on){
				button.text("✖").on("click",null)
			  nav.style("overflow-y","visible")
				
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
					div_menu.style("overflow", "visible");
	        menu_on = true;
	      });    
		  }else{
		    button.text("☰").on("click",null);    
				nav.style("overflow-y","hidden");
				
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
			.attr("class", "div-menu")
			.style({
        "width": width+"px",
				"height": height*2+"px",
				"vertical-align": "middle",
				"line-height": height+"px",
				"overflow": "hidden",
				"color": "white"
			});
			
			

		var button = div_menu.append("xhtml:a")
			.style("width", height+"px")			
			.attr("class", "open-menu")
		  .attr("href", "#")
			.text("☰")
			.on("click", toggle);
 

		var menu = 
			[
			  {
			    name:"Peaks",
			    children:[
			      {
							name:"Pick peaks",
							children:[
								{name:"Manual peak picking",fun:events.peakpickToggle},
							  {
									name:"Automatic using threshold",
									fun: function () {
										d3.select(".main-focus").node().getThreshold(
												function (t) { pro.pp("threshold", t); }
										);									
							  	}
								},
							  {
									name:"Peak segments using threshold",
									fun: function () {
										d3.select(".main-focus").node().getThreshold(
												function (t) { pro.pp("threshold", t, true); }
										);
							  	}
								},
							  {
									name:"Automatic using CWT",
									fun: function () {
										pro.pp("cwt");
							  	}
								},								
							]
						},
			  		{name:"View/manage peak table",fun:null},
						{name:"Delete peaks",fun:events.peakdelToggle},
    			]
			  },
				{
					name:"Baseline",
					children:[
						{name:"Constant baseline correction",fun:function(){pro.bl(prev_bl, {a:"cbf"})} },
						{name:"Median baseline correction",fun:function(){pro.bl(prev_bl, {a:"med"})} },
						{name:"Advanced options",fun:modals.bl},
					],
				},
				{
					name:"View",
					children:[
						{
							name:"Change region",
							children:[
								{name:"Set X region",fun:modals.xRegion},
								{name:"Set Y region",fun:modals.yRegion},
								{name:"Full spectrum",fun:dispatcher.regionfull,
									children:[{name:"Set X region",fun:modals.xRegion},]
								},
								{name:"Reverse Spectrum",fun:null},
								{name:"Invert Phases",fun:null},
							]
						},
					],
				},
			  {
					name:"Integration",
					fun:events.integrateToggle,
				},
			  {name:"crosshair",fun:events.crosshairToggle},
			  {name:"Selected",fun:function(){},
					children:[
						{name:"Scale",fun:modals.scaleLine},
					]
				},
				{
					name:"Export",
					children:[
						{name:"As PNG",fun:function(){
							setTimeout(function(){savePNG(svg.selectP("svg"), "specdraw.png")},500);
						}},
						{name:"As SVG",fun:function(){
							setTimeout(function(){saveSVG(svg.selectP("svg"), "specdraw.svg")},500);
						}},
						{name:"CSV",fun: function(){}},
						{name:"Peak table",fun:function(){}},
						{name:"JCAMP-DX",fun:function(){}},
					],
				},
			];
			
			var nav = div_menu.append("ul")
				.attr("class","nav")
				.style("overflow-y","hidden")
				.call(css_trans("translateX("+ (-width) + "px)"));

			var first = nav.selectAll("li").data(menu);
				
			first.enter()
				.append("li")
					.append("a")
					.text(function(d){return d.name+ (d.children?" ▼":"");})
					.attr("href", "#")
					.on("click", function(d){ if(d.fun){ toggle(); d.fun();}})

			arr2el(first, function (_sel) {
				var ret = _sel.append("div").append("ul").attr("class", "nav-column")
					.selectAll("li").data(function(d){return d.children});
				
				ret.enter()
				  .append("li")
						.append("a")
						.text(function(d){return d.name;})
						.attr("href", "#")
						.on("click", function(d){ if(d.fun){ toggle(); d.fun();}})
						.append("a")
						.text(function(d){return (d.children?" ▶":"")});
				
				return ret;
			});
			
		return svg_elem;									
	}
	
	function arr2el(sel, fun){
		var second = fun(sel.filter(function(d){return d.children;}));
	
		if(second.filter(function(d){return d.children;}).size() > 0)
			arr2el(second, fun);
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

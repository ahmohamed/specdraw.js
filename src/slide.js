module.exports = function(){
	var core = require('./elem');
	var source = core.Elem('g');
	core.inherit(Slide, source);
	
	var data, slide_selection, svg_selection, svg_width, svg_height;
	var clip_id = require('./utils/guid')();
	var parent_app, spec_container;
	
	// Event dispatcher to group all listeners in one place.
	var dispatcher = d3.dispatch(
		"rangechange", "regionchange", "regionfull", "redraw",  	//redrawing events
		'specDataChange',
		"mouseenter", "mouseleave", "mousemove", "click", 	//mouse events
		"keyboard",																//Keyboard
		"peakpickEnable", "peakdelEnable", "peakpick", "peakdel",		//Peak picking events
		"integrateEnable", "integrate", "integ_refactor",						//Integration events
		"crosshairEnable",
		"blindregion",
		"log"
	);
	function create_empty_slide(app) {
		svg_selection = app.append('div')
			.text('This slide does not contain any spectra. Click to add one.')
			.style({
				width: (svg_width+'px'),
				'line-height': (svg_height+'px'),
				'text-align': 'center',
    		'vertical-align': 'middle'
			})
			.classed('spec-slide empty', true)
			.on('click', require('./pro/open-file')(app) );
		console.log(Slide.addSpec);
	}
	
	function Slide(app){
		parent_app = app;
		svg_width = Slide.width();
		svg_height = Slide.height();
		
		if(!data){
			create_empty_slide(app);
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
		dispatcher.idx = 0;
		
		svg_selection = app.append('svg')
			.classed('spec-slide', true)
			.attr({
				width:svg_width,
				height:svg_height
			});
			
		slide_selection = source(svg_selection)
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.attr({
				width:svg_width,
				height:svg_height
			});
		
		//var contents = slide_selection
			//.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		
    var defs = slide_selection.append("defs");
		defs.append("clipPath")
		.attr("id", clip_id)
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
			var slope = 1;
			if (require('bowser').safari) {
			  slope *= 2;
			}
			var svg_filter = defs.append("filter").attr("id", "2dColorFilter");
			svg_filter.append("feColorMatrix")
				.attr("type","matrix")
				.attr("values","1 0 0 0 0	0 0 0 0 0 1 0 0 0 0 0 0 0 1 0");
	
			var fe_component_transfer = svg_filter.append("feComponentTransfer")
				.attr("color-interpolation-filters","sRGB");
	
			fe_component_transfer.append("feFuncR")
				.attr("type","linear")
				.attr("slope",-slope)
				.attr("intercept","0.5");
				
			fe_component_transfer.append("feFuncB")
				.attr("type","linear")
				.attr("slope",slope)
				.attr("intercept","-0.5");
	
			fe_component_transfer = svg_filter.append("feComponentTransfer")
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
		slide_selection.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")");
			

		slide_selection.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + width + ",0)");
		
		slide_selection.append("g").classed('x grid', true);
		slide_selection.append("g").classed('y grid', true);
		
		slide_selection.append("text")
	    .attr("class", "x label")
	    .attr("text-anchor", "middle")
	    .attr("x", width/2)
	    .attr("y", height)
			.attr("dy", "2.8em")
	    .text("Chemical shift (ppm)");
		
		slide_selection.append("text")
	    .attr("class", "y label")
	    .attr("text-anchor", "end")
	    .attr("y", width)
	    .attr("dy", "-.75em")
	    .attr("transform", "rotate(-90)")
	    .text("Intensity");
		
		dispatcher.on("redraw.slide", function (e) {
			if(e.x){
				slide_selection.select(".x.axis").call(xAxis);
				if(app.options.grid.x){
					slide_selection.select(".x.grid").call(xGrid);
				}
			}
			if(e.y){
				slide_selection.select(".y.axis").call(yAxis);
				if(app.options.grid.y){
					slide_selection.select(".y.grid").call(yGrid);
				}
			}
		});
		
		spec_container = two_d ? require('./d2/spec-container-2d')() : require('./d1/spec-container-1d')();
		//Spec-Container
		spec_container
			.datum(data)
			.xScale(x)
			.yScale(y)
			.width(width)
			.height(height)
			.dispatcher(dispatcher)
			(Slide);
		
		//Scale brushes
		require('./d1/scale-brush')()
			.xScale(x)
			.dispatcher(dispatcher)
			(Slide);
				
		require('./d1/scale-brush')()
			.yScale(y)
			.dispatcher(dispatcher)
			(Slide);
		
		d3.rebind(Slide, spec_container, 'spectra', 'addSpec', 'changeRegion', 'range');
	}
	Slide.show = function (_) {
		if(svg_selection){
			svg_selection.classed('active', _);	
		}		
	};
	Slide.nd = function(){
		if (!data){ //TODO: empty slide?
			return 0;
		}
		return (data["nd"] && data["nd"] === 2) ? 2 : 1;
	};
	Slide.clipId = function(){
		return clip_id;
	};
	Slide.slideDispatcher = function(){
		return dispatcher;
	};
	Slide.specContainer = function(){
		return spec_container;
	};
  Slide.datum = function(_){
    if (!arguments.length) {return data;}
    data = _;
    return Slide;
  };
	Slide.parent = function () {
		return parent_app;
	};
	Slide.spectra = function () {
		// This is called only when spec_container is not present, i.e. empty slide.
		return [];
	};
	Slide.addSpec = function (_) { 
		// This is called only when spec_container is not present, i.e. empty slide.
		console.log('first spec', svg_selection.node());
		svg_selection.remove(); // remove the empty slide.
		Slide.datum(_)(parent_app);	// call the slide again with the data.
		if (parent_app.currentSlide() === Slide) { Slide.show(true); }
		console.log('added spec', svg_selection.node());
	};
	return Slide;
};

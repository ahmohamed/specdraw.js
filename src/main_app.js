/*
	import 'event';
	import 'menu';
	import 'slide';
*/
spec.app = function(){
  var slides = [], elem, svg_width, svg_height;

  function _main(div){
    /* * Check size definitions**/
		if (typeof svg_width === 'undefined' || typeof svg_height === 'undefined'
			|| isNaN(svg_width) || isNaN(svg_height)){
				var parent_svg = div.node();
				var dimensions = parent_svg.clientWidth ? [parent_svg.clientWidth, parent_svg.clientHeight]
					: [parent_svg.getBoundingClientRect().width, parent_svg.getBoundingClientRect().height];
				
				svg_width = dimensions[0] - 50; //deduct 50px for column menu.
				svg_height = dimensions[1];
		};
		
    if (svg_width < 400 || svg_height < 400){
      throw new Error("SpecApp: Canvas size too small. Width and height must be at least 400px");
    }
		
		
		var app_dispatcher = d3.dispatch('slideChange', 'slideContentChange', 'menuUpdate');
		
		elem = div.append('div')
			.classed('spec-app', true)
			.attr({
				width:svg_width,
				height:svg_height				
			});
		
		elem.node().dispatcher = app_dispatcher;
		require('./src/modals').init(elem.node());
		// TODO: decide whether to inject CSS styles.
		//applyCSS2();
		
		elem.call(spec.menu());
		/*var svg_elem = elem.append('svg')
			.attr({
				width:svg_width,
				height:svg_height				
			}).append('g');
		*/
		//elem.call(spec.slideChanger());
		/**** Keyboard events and logger ****/
		registerKeyboard(elem.node());
		
		elem.node().appendSlide = function (data) {
			elem.selectAll('.spec-slide').classed('active', false);
			elem.call(
				spec.slide()
					.datum(data)
					.width(svg_width)
					.height(svg_height)
			);
			app_dispatcher.slideChange();
			//elem.call(spec.slideChanger());
		};
		elem.node().appendToCurrentSlide = function (data) {
			var current_slide = elem.select('.spec-slide.active').node();
			if(!current_slide){
				elem.node().appendSlide(data);
			}	else{
				current_slide.addSpec(data);
				app_dispatcher.slideContentChange();
			}
		};
		
		elem.node().options = _main.options;
		app_dispatcher.on('slideChange.app', function () {
			elem.node().slideDispatcher = elem.select('.spec-slide.active').node().slideDispatcher;
		});
		
		for (var i = 0; i < slides.length; i++) {
			elem.node().appendSlide(slides[i].slide);
		}		
	}
	
	_main.appendSlide = function(data){
		if (!arguments.length) 
			throw new Error("appendSlide: No data provided.");
		
		if (elem){
			elem.node().appendSlide(data);
		} else{
			slides.push({'slide':data});
		}
		return _main;
	};
	_main.appendToCurrentSlide = function(data){
		if (!arguments.length) 
			throw new Error("appendToCurrentSlide: No data provided.");
		
		if (elem){
			elem.node().appendToCurrentSlide(data);
		} else{
			if(slides.length === 0) //No slides available; create a new one
				return _main.appendSlide(data);
			
			//Otherwise, append data to last slide.
			var current_slide = slides[slides.length-1].slide;
			//TODO: BUG
			//We don't know if the array in slide is a data array 
			// or an array of data arrays (i.e dataset)
			current_slide.push(data);
			
			return _main;
		}
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
	_main.options = {
		grid:{x:false, y:false}
	};
	return _main;
};

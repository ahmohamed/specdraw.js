/*
	import 'event';
	import 'menu';
	import 'slide';
*/
spec.app = function(){
  var slides = [], elem, svg_width, svg_height;

  function _main(svg){
    /* * Check size definitions**/
    if (typeof svg_width === 'undefined' || typeof svg_height === 'undefined'){
        svg_width = +svg.attr("width");    svg_height = +svg.attr("height");    
    }
		if (typeof svg_width === 'undefined' || typeof svg_height === 'undefined'
			|| isNaN(svg_width) || isNaN(svg_height)){
				var parent_svg = svg.node();
				var dimensions = parent_svg.clientWidth ? [parent_svg.clientWidth, parent_svg.clientHeight]
					: [parent_svg.getBoundingClientRect().width, parent_svg.getBoundingClientRect().height];
				
				svg_width = dimensions[0];				
				svg_height = dimensions[1];
		}
        
    if (svg_width < 100 || svg_height < 100){
      throw new Error("SpecApp: Canvas size too small. Width and height must be at least 100px");
    }
		
		elem = svg.append('g')
			.classed('spec-app', true)
			.attr('width', svg_width)
			.attr('height', svg_height);
		
		// TODO: decide whether to inject CSS styles.
		//applyCSS2();
		
		elem.call(spec.menu());
		elem.call(spec.slideChanger());
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
			elem.call(spec.slideChanger());
		};
		elem.node().appendToCurrentSlide = function (data) {
			var current_slide = elem.select('.spec-slide.active').node()
			if(!current_slide){
				elem.node().appendSlide(data);
			}	else{
				current_slide.addSpec(data);
			}
		};
		
		for (var i = 0; i < slides.length; i++) {
			elem.appendSlide(slides[i].slide);
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
	return _main;
};

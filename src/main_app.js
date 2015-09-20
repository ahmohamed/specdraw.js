module.exports = function(){
	var core = require('./elem');
	var source = core.Elem().class('spec-app');
	core.inherit(App, source);
	
  var selection, svg_width, svg_height;
	var app_dispatcher = d3.dispatch('slideChange', 'slideContentChange', 'menuUpdate');
	var modals;
	var slides = core.ElemArray(), current_slide;
	
  function App(div){
		svg_width = App.width();
		svg_height = App.height();
		
    /* * Check size definitions**/
		if (typeof svg_width === 'undefined' ||
			typeof svg_height === 'undefined' ||
			isNaN(svg_width) || isNaN(svg_height)
		){
				var parent_svg = div.node();
				var dimensions = parent_svg.clientWidth ? [parent_svg.clientWidth, parent_svg.clientHeight]
					: [parent_svg.getBoundingClientRect().width, parent_svg.getBoundingClientRect().height];
				
				svg_width = dimensions[0]; //deduct 50px for column menu.
				svg_height = dimensions[1];
		}
		
    if (svg_width < 400 || svg_height < 400){
      throw new Error("SpecApp: Canvas size too small. Width and height must be at least 400px");
    }
		
		selection = source(div)
			.style({
				width:svg_width,
				height:svg_height				
			});
		
		svg_width -= 50; //deduct 50px for column menu.
		
		modals = require('./modals')(App);
		require('./menu/menu')(App);

		/**** Keyboard events and logger ****/
		require('./events').registerKeyboard(App);
		
		selection.node().appendToCurrentSlide = function (data) {
			var current_slide = selection.select('.spec-slide.active').node();
			if(!current_slide){
				selection.node().appendSlide(data);
			}	else{
				current_slide.addSpec(data);
				app_dispatcher.slideContentChange();
			}
		};
		
		//selection.node().options = App.options;
		app_dispatcher.on('slideChange.app', function (s) {
			if (current_slide !== s) { App.currentSlide(s);	}
		});
		
		for (var i = 0; i < slides.length; i++) {
			render_slide(slides[i]);
		}
	}
	function render_slide(s) {
		if(! selection){ return; }
		s.width(svg_width).height(svg_height)
			(App);
		
		App.currentSlide(s);
	}
	
	App.slides = function () {
		return slides;
	};
	App.currentSlide = function (s) {
		if (!arguments.length) { return current_slide; }
		if (current_slide) { // When the first slide is added, no current_slide.
			current_slide.show(false);
		}
		s.show(true);
		current_slide = s;
		app_dispatcher.slideChange(s);
	};
	App.dispatcher = function () {
		return app_dispatcher;
	};
	App.slideDispatcher = function () {
		return current_slide.slideDispatcher();
	};
	App.modals = function () {
		return modals;
	};
	App.pluginRequest = require('./pro/plugins')(App);
	App.appendSlide = function(data){
		if (!arguments.length){
			throw new Error("appendSlide: No data provided.");
		} 
		
		var s = require('./slide')().datum(data);
		slides.push(s);
		render_slide(s);
		return App;
	};
	App.appendToCurrentSlide = function(data){
		if (!arguments.length){
			throw new Error("appendToCurrentSlide: No data provided.");
		} 
		
		if (selection){
			selection.node().appendToCurrentSlide(data);
		} else{
			if(slides.length === 0){ //No slides available; create a new one
				return App.appendSlide(data);
			}
			//Otherwise, append data to last slide.
			var current_slide = slides[slides.length-1].slide;
			//TODO: BUG
			//We don't know if the array in slide is a data array 
			// or an array of data arrays (i.e dataset)
			current_slide.push(data);
			
			return App;
		}
	};
	App.options = {
		grid:{x:false, y:false}
	};
	return App;
};

//TODO: remove Elements

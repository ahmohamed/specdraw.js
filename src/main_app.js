module.exports = function(){
	var core = require('./elem');
	var source = core.Elem().class('spec-app');
	core.inherit(App, source);
	
  var selection, svg_width, svg_height;
	var app_dispatcher = d3.dispatch('slideChange', 'slideContentChange', 'menuUpdate');
	var modals;
	var slides = core.ElemArray(), current_slide;
	function check_size(divnode) {
		svg_width = App.width();
		svg_height = App.height();
		if (typeof svg_width === 'undefined' ||
			typeof svg_height === 'undefined' ||
			isNaN(svg_width) || isNaN(svg_height)
		){
			var size = require('./utils/get-size')(divnode);
			svg_width = size[0];
			svg_height = size[1];
			if (typeof svg_width === 'undefined' ||
				typeof svg_height === 'undefined'){
					return false;
				}
		}
		if (svg_width < 400 || svg_height < 400){return false;}
		return true;
	}
	
	function App(div) {
		if(!check_size(div.node())){
			require('./utils/docready')(function () {	render(div); });
			return;
		}		
		render(div);
	}
	
  function render(div){
    if ( !check_size(div.node()) ){
			if(div.node().tagName.toLowerCase() === 'specdraw-js'){
				// When web components are used, the element's dimensions are not
				// set even when the DOM is ready. However, the container div is set.
				if (!check_size(div.node().parentNode)){
					throw new Error("SpecApp: Canvas size too small. Width and height must be at least 400px");
				}
			}else{
				throw new Error("SpecApp: Canvas size too small. Width and height must be at least 400px");	
			}
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
		if(slides.length === 0){
			App.appendSlide();
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
		if (!arguments.length) { return current_slide || slides[slides.length -1]; }
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
		var s = require('./slide')().datum(data);
		slides.push(s);
		render_slide(s);
		return App;
	};
	App.options = {
		grid:{x:false, y:false}
	};
	App.data = function (url, s_per_slide) {
		if(typeof s_per_slide === 'undefined'){
			s_per_slide = 5;
		}
		var callback = function (data) {
			if(!App.currentSlide() || App.currentSlide().spectra().length  > s_per_slide - 1){
				App.appendSlide(data);
			}else{
				App.currentSlide().addSpec(data);
			}
		};
		
		require('./pro/process_data').get_spectrum(url,	callback);
		return App;
	};
	return App;
};

//TODO: remove Elements

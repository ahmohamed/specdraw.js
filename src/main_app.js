module.exports = function(){
  var core = require('./elem');
  var source = core.Elem().class('spec-app');
  core.inherit(App, source);
  
  var selection, app_width, app_height;
  var app_dispatcher = d3.dispatch('slideChange', 'slideContentChange', 'menuUpdate');
  var modals, config = 3;
  var slides = core.ElemArray(), current_slide;
  var base_url = '/nmr/';
  
  function check_size(divnode) {
    app_width = App.width();
    app_height = App.height();
    if (typeof app_width === 'undefined' ||
      typeof app_height === 'undefined' ||
      isNaN(app_width) || isNaN(app_height)
    ){
      var size = require('./utils/get-size')(divnode);
      app_width = size[0];
      app_height = size[1];
      if (typeof app_width === 'undefined' ||
        typeof app_height === 'undefined'){
          return false;
        }
    }
    if (app_width < 400 || app_height < 400){return false;}
    return true;
  }
  
  function App(div) {
    if(!check_size(div.node())){
      require('./utils/docready')(function () {  render(div); });
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
          //TODO: better response when canvas is small
          throw new Error("SpecApp: Canvas size too small. Width and height must be at least 400px");
        }
      }else{
        throw new Error("SpecApp: Canvas size too small. Width and height must be at least 400px");  
      }
    }
    
    selection = source(div)
      .style({
        width:app_width,
        height:app_height        
      });
    modals = require('./modals')(App);
    
    if(config > 1){
      require('./menu/menu')(App);
      app_width -= 50; //deduct 50px for column menu.
      /**** Keyboard events and logger ****/
      require('./events').registerKeyboard(App);
    }
    
    app_dispatcher.on('slideChange.app', function (s) {
      if (current_slide !== s) { App.currentSlide(s);  }
    });
    
    for (var i = 0; i < slides.length; i++) {
      render_slide(slides[i]);
    }
    if(slides.length === 0){
      App.appendSlide();
    }
    
    require('./logo')(App);
  }
  function render_slide(s) {
    if(! selection){ return; }
    s.width(app_width).height(app_height)
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
  App.config = function (_) {
    if (!arguments.length) {return config;}
    config = _;
    
    return App;
  };
  App.connect = function (url){
    if (!arguments.length) {return base_url;}
    base_url = url;
    config = 4;
    
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
        App.currentSlide().addSpec(data, config > 1);
      }
    };
    
    require('./pro/process_data').get_spectrum(url,  callback);
    return App;
  };
  return App;
};

//TODO: remove Elements

module.exports = function () {
  var core = require('../elem');
  var source = core.SVGElem().class('main-focus');
  core.inherit(SpecContainer, source);

  var x, y, dispatcher, data;
  var focus, range = {};
  var specs = core.ElemArray();
  var main_brush = require('../d1/main-brush')();
  
  var zoomer = d3.behavior.zoom()
    .on("zoom", function (){
      var slide = SpecContainer.parent();
      
      slide.select("#rfunc").attr("slope", zoomer.scale());
      slide.select("#bfunc").attr("slope", zoomer.scale());
    }).scaleExtent([0.1,100]);  
  
  function SpecContainer(slide) {
    x = SpecContainer.xScale();
    y = SpecContainer.yScale();
    dispatcher = SpecContainer.dispatcher();
    
    focus = source(slide)
      .attr("pointer-events", "all")
      .attr('clip-path', "url(#" + slide.clipId() + ")")
      .attr("width", SpecContainer.width())
      .attr("height", SpecContainer.height())
      .call(zoomer) // TODO: if app.config > 1
      .on("dblclick.zoom", null)
      .on("mousedown.zoom", null);
        
    
    /*********** Handling Events **************/
    focus
      .on("_redraw", function(e){      
        dispatcher.redraw(e);
      })
      .on("_regionchange", function(e){
        // If the change is in X
        if(e.xdomain){
          x.domain(e.xdomain);  
        }        
        //dispatcher.regionchange({xdomain:e.xdomain});
              
        if(e.ydomain){
          y.domain(e.ydomain);          
        }
        
        dispatcher.regionchange({xdomain:e.xdomain, ydomain:y.domain()});
        focus.on("_redraw")({x:e.xdomain, y:true});
      })
      .on("_rangechange", function(e){
        if(e.x)
          {range.x = e.x;}
        if(e.y)
          {range.y = e.y;}
      
        dispatcher.rangechange(e);
        
        if(!e.norender){
          focus.on("_regionchange")({xdomain:range.x, ydomain:range.y});
        } 
      });
      
    if (SpecContainer.parentApp().config() > 1){
      focus.on("mouseenter", dispatcher.mouseenter)
        .on("mouseleave", dispatcher.mouseleave)
        .on("mousemove", function(){
          var new_e = d3.event;
          new_e.xcoor = d3.mouse(this)[0];
          new_e.ycoor = d3.mouse(this)[1];
      
          dispatcher.mousemove(new_e);
        })
        .on("mousedown", function () {  // Why?! because no brush when cursor on path?
          var new_click_event = new Event('mousedown');
          new_click_event.pageX = d3.event.pageX;
          new_click_event.clientX = d3.event.clientX;
          new_click_event.pageY = d3.event.pageY;
          new_click_event.clientY = d3.event.clientY;
          focus.select(".main-brush").node()
            .dispatchEvent(new_click_event);
        })
        .on("click", function(){
          var new_e = d3.event;
          new_e.xcoor = d3.mouse(this)[0];
          new_e.ycoor = d3.mouse(this)[1];
    
          dispatcher.click(new_e);
        })
        .on("dblclick", dispatcher.regionfull);

      dispatcher.on("regionfull",function () {
      focus.on("_regionchange")({xdomain:range.x, ydomain:range.y});    
    });
    }
    //spectral lines
    for (var i = 0; i < specs.length; i++) {
      render_spec(specs[i]);
    }
    //brushes
    if (SpecContainer.parentApp().config() > 1){
      main_brush
        .xScale(x)
        .yScale(y)
        .dispatcher(dispatcher)
        (SpecContainer);
    }
    
  }
  function render_spec(s) {
    if(!focus){return;}

    s.xScale(x).yScale(y)
      .dispatcher(dispatcher)
      (SpecContainer);
        
    update_range();
  }
  function update_range() {
    var x0 = d3.max(specs.map(function(s){return s.range().x[0];})),
      x1 = d3.min(specs.map(function(s){return s.range().x[1];})),
      y0 = d3.min(specs.map(function(s){return s.range().y[0];})),
      y1 = d3.max(specs.map(function(s){return s.range().y[1];}));
    

    var xdomain = x.domain(), ydomain = y.domain();
    focus.on("_rangechange")({x:[x0,x1], y:[y0,y1], norender: specs.length > 1});

    if(specs.length > 1){
      focus.on("_regionchange")({xdomain:xdomain, ydomain:ydomain});
    }
  }
  
  SpecContainer.addSpec = function(spec_data, crosshair){
    if (!arguments.length) {
      throw new Error("appendSlide: No data provided.");
    } 
    
    if(typeof crosshair === 'undefined'){
      crosshair = true;
    }
    var s = specs.filter(function (e) {
      return e.s_id() === spec_data["s_id"];
    }  );
    
    require('../pro/process_data').process_spectrum(spec_data, function (response) {
      console.log("process_data", response);
      if ( s.length === 0 ){
        if(specs.length !== 0){ //TODO: Until we support 2D datasets.
          SpecContainer.ready(function(){
            SpecContainer.parentApp().appendSlide(response);
          });
          return;
        }
      
        s = require('./spec2d')()
          .datum(response["data"])
          .s_id(response["s_id"])
          .label(response["label"])
          .crosshair(crosshair)
          .range({x:response["x_domain"], y:response["y_domain"]});
        
        specs.push(s);
  			render_spec(s);
      }else{
        s = s[0];
        s.datum(response["data"])
          .range({x:response["x_domain"], y:response["y_domain"]});
      }
    });
    
    return s;
  };
  SpecContainer.highlightSpec = function(){};
  SpecContainer.changeRegion = function (_) {
    if( focus ){
      focus.on('_regionchange')(_);
    }
  };
  SpecContainer.nd = function(){
    return 2;
  };
  SpecContainer.spectra = function () {
    return specs;
  };
  SpecContainer.range = function(){
    return range;
  };
  SpecContainer.datum = function(_){
    if (!arguments.length) {return data;}
    if (_.constructor === Array) {
      // if data is an Array, take first element.
      _ = _[0];
    }
    data = _;
    
    SpecContainer.addSpec(_);
    return SpecContainer;
  };
  return SpecContainer;  
};
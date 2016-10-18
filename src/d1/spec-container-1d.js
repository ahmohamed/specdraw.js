module.exports = function () {
  var core = require('../elem');
  var source = core.SVGElem().class('main-focus');
  core.inherit(SpecContainer, source);
  
  
  var focus, x, y, dispatcher, data, range = {};
  var x_label;
  var specs = core.ElemArray();
  var peak_picker = require('./peak-picker')();
  var main_brush = require('./main-brush')();
  
  var timestamp = 0;
  var zoomer = d3.behavior.zoom()
    .on("zoom", function () {
      if(d3.event.sourceEvent.timeStamp - timestamp < 50){
            return;
      }
      timestamp = d3.event.sourceEvent.timeStamp;
      /* * When a y brush is applied, the scaled region should go both up and down.*/
      var new_range = range.y[1]/zoomer.scale() - range.y[0];
      var addition = (new_range - (y.domain()[1] - y.domain()[0]))/2;
    
      var new_region = [];
      if(y.domain()[0] === range.y[0]) { new_region[0] = range.y[0]; }
      else{new_region[0] = Math.max(y.domain()[0]-addition, range.y[0]);}
      new_region[1] = new_region[0] + new_range;
      
      focus.on("_regionchange")(
        {zoom:true,  ydomain:new_region}
      );
    });
  
  
  function addSpec(spec_data) {
    // TODO: s_id is only present in 'connected' mode.
    var s_id = null;
    var spec_label = 'spec '+specs.length;

    //if(typeof spec_data["s_id"] !== 'undefined') {s_id = spec_data["s_id"];}
    if(typeof spec_data['label'] !== 'undefined') {spec_data['label'] = spec_data["label"];}
    
    // Find the spectrum with the same s_id.
    // If it is present, overwrite it.
    // Otherwise, create a new spectrum.
    var s = specs.filter(function (e) {
      return e.s_id() === s_id;
    });
    
    if (specs.length === 1) { 
      x_label = spec_data['x_label']; 
    }
    require('../pro/process_data').process_spectrum(spec_data, function (response) {
      if ( s.length === 0 ){
        s = require('./line')()
          .datum(response)
  //        .crosshair(true) // TODO: fix crosshair
  //        .s_id(s_id)
  //        .label(spec_label);
      
        specs.push(s);
        render_spec(s);
      }else{
        s = s[0];
        s.datum(spec_data);//TODO: setData!!
        update_range();
      }
    });
    if(SpecContainer.parentApp()){
      SpecContainer.parentApp().dispatcher().slideContentChange();
    }
    return s;
  }
  function check_data(data) {
    if (data.constructor !== Array) {
      // if data is not an Array, wrap it in an Array.
      data = [data];
    }
    for (var i = 0; i < data.length; i++) {
      addSpec(data[i]);
    }
    return data;
  }
  function SpecContainer(slide) {
    x = SpecContainer.xScale();
    y = SpecContainer.yScale();
    dispatcher = SpecContainer.dispatcher();
    
    focus = source(slide)
      .attr("pointer-events", "all")
      .attr('clip-path', "url(#" + slide.clipId() + ")")
      .attr("width", SpecContainer.width())
      .attr("height", SpecContainer.height())
      .call(zoomer)
      .on("dblclick.zoom", null)
      .on("mousedown.zoom", null);
    
    
    // overlay rectangle for mouse events to be dispatched.
    focus.append("rect")
      .attr("width", SpecContainer.width())
      .attr("height", SpecContainer.height())
      .style("fill", "none");
    
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
        dispatcher.regionchange({xdomain:e.xdomain});
              
        if(e.ydomain){
          y.domain(e.ydomain);
          if(!e.zoom){//If y domain is changed by brush, adjust zoom scale
            zoomer.scale((range.y[0]-range.y[1])/(y.domain()[0]-y.domain()[1]));            
          } 
        }else{
          //modify range.y  and reset the zoom scale
          var s = SpecContainer.spectra(true);
          if (s.length === 0){// if no spectra are selected.
            s = specs;        // use all spectra.
          }
          var y0 = d3.min(s.map(function(s){return s.range().y[0];})),
            y1 = d3.max(s.map(function(s){return s.range().y[1];}));
          var y_limits = (y1-y0);
          y0 = y0 - (0.05 * y_limits);
          y1 = y1 + (0.05 * y_limits);
          
          
          range.y = [y0,y1];
          y.domain(range.y);
          dispatcher.rangechange({y:range.y});
          zoomer.scale(1);
        }
      
        dispatcher.regionchange({ydomain:y.domain()});
        focus.on("_redraw")({x:e.xdomain, y:true});
      })
      .on("_rangechange", function(e){
        if(e.x) { range.x = e.x; }  
        if(e.y) { range.y = e.y; }
      
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
    }
    
    dispatcher.on("regionfull",function () {
      focus.on("_regionchange")({xdomain:range.x});    
    });
      
    
    //brushes
    if (SpecContainer.parentApp().config() > 1){
      main_brush.xScale(x)
        .dispatcher(dispatcher)
        (SpecContainer);      
    }
  

    //spectral lines
    for (var i = 0; i < specs.length; i++) {
      render_spec(specs[i]);
    }
    
    //peak picker  
    if (SpecContainer.parentApp().config() > 2){
      peak_picker.xScale(x)
        .yScale(y)
        .dispatcher(dispatcher)
        (SpecContainer);
    }    
  }
  function update_range() {
    if(!focus){return;}
    
    var sel = SpecContainer.spectra(true);
    if (sel.length === 0){// if no spectra are selected.
      sel = specs;        // use all spectra.
    }
    
    var x0 = d3.max(sel.map(function(s){return s.range().x[0];})),
      x1 = d3.min(sel.map(function(s){return s.range().x[1];})),
      y0 = d3.min(sel.map(function(s){return s.range().y[0];})),
      y1 = d3.max(sel.map(function(s){return s.range().y[1];}));
    
    // Add 5% margin to top and bottom (easier visualization).
    var y_limits = (y1-y0);
    y0 = y0 - (0.05 * y_limits);
    y1 = y1 + (0.05 * y_limits);

    var xdomain = x.domain();
    focus.on("_rangechange")({x:[x0,x1], y:[y0,y1], norender: specs.length > 1});

    if(specs.length > 1){
      focus.on("_regionchange")({xdomain:xdomain});  
    }
  }
  
  function render_spec(s) {
    if(!focus){return;}
    
    s.xScale(x).yScale(y)
      .dispatcher(dispatcher)
      (SpecContainer);
        
    update_range();
  }
  
  SpecContainer.changeRegion = function (_) {
    if( focus ){
      focus.on('_regionchange')(_);
    }
  };
  SpecContainer.addSpec = addSpec;
  
  SpecContainer.addPeaks = function (idx) { //TODO:move peaks to line
    if(!focus){return;}
    focus.select(".peaks").node().addpeaks(data.subset(idx));      
    focus.select(".peaks").on("_regionchange")({xdomain:true});
    focus.select(".peaks").on("_redraw")({x:true});      
  };
  SpecContainer.nd = function(){
    return 1;
  };
  SpecContainer.spectra = function (selected) {
    if (!selected){return specs;}
    
    return  specs.filter( function (s) { return s.selected(); } );
  };
  SpecContainer.highlightSpec = function (_) {
    var s_idx = specs.indexOf(_);
    if(s_idx < 0){ //no spectrum to highlight
      specs.sel().classed('dimmed', false)
        .classed('highlighted', false);
    }else{
      specs.sel().classed('dimmed', true);
      _.sel().classed('highlighted', true);
    }    
  };
  SpecContainer.peakPicker = function () {
    return peak_picker;
  };
  SpecContainer.mainBrush = function () {
    return main_brush;
  };
  SpecContainer.range = function(){
    return range;
  };
  SpecContainer.datum = function(_){
    if (!arguments.length) {return data;}
    data = check_data(_);
    
    //TODO: Clear all spectra first.
    //SpecContainer.addSpec(_);
    return SpecContainer;
  };
  
  
  return SpecContainer;
};
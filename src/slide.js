module.exports = function(App){
  var core = require('./elem');
  var source = core.Elem('g');
  core.inherit(Slide, source);
  
  var data, tow_d, slide_selection, svg_selection, svg_width, svg_height;
  var clip_id = require('./utils/guid')();
  var filter_id = require('./utils/guid')();
  var parent_app, spec_container;
  
  // Event dispatcher to group all listeners in one place.
  var dispatcher = d3.dispatch(
    "rangechange", "regionchange", "regionfull", "redraw",    //redrawing events
    'specDataChange',
    "mouseenter", "mouseleave", "mousemove", "click",   //mouse events
    "keyboard",                                //Keyboard
    "peakpickEnable", "peakdelEnable", "peakpick", "peakdel",    //Peak picking events
    "integrateEnable", "integrate", "integ_refactor",            //Integration events
    "crosshairEnable",
    "blindregion",
    "log"
  );
  function create_empty_slide(app) {
    svg_selection = app.append('div')
      .text('This slide does not contain any spectra. Click to add one.')
      .style({
        width: (svg_width+'px'),
        'line-height': (svg_height+'px')
      })
      .classed('spec-slide empty', true)
      .on('click', require('./pro/open-file')(app) );
  }
  
  /** Slide inspect the data and determine the following:
      * Whether it should be a 1D or 2D slide.
      * Whether to accept part of all of the data.
        - if the number of spectra is > App.option.slideMax
        - Spectra are of different dimensions.
  */  
  function check_data(all_data) {
    console.log('slide check_data', all_data.length);
    console.trace();
    
    function is_towd_data(_datum) {
      return (_datum["nd"] && _datum["nd"] === 2);
    }
    if (all_data.constructor !== Array) {
      // if data is not an Array, wrap it in an Array.
      all_data= [all_data];
    }
    
    var new_data = [all_data[0]];
    two_d = is_towd_data(new_data[0]);
    
    // 2D slides accpet only a single spectrum.
    var slide_max = two_d ? 1 : App.options('slideMax');
    if (slide_max < 1) { slide_max = 1;} // min 1 spec/slide.
    

    for (var i = 1; i < slide_max && i < all_data.length; i++) {
      if (is_towd_data(all_data[i]) !== two_d){
        break; // if the spec is of a different dimension..
      }
      console.log("spec "+i+" added.");
      new_data.push(all_data[i]);
    }
    
    
    
    if (new_data.length < all_data.length){
      var rem_data = all_data.slice(new_data.length, all_data.length)
      console.log("remaining data.length", new_data.length, rem_data.length);
      // Transfer the remaining data to the next slide.
      App.appendSlide(rem_data, false);
    }
    console.log("spec "+new_data);
    return new_data;
  }

  function Slide(app){
    parent_app = app;
    svg_width = Slide.width();
    svg_height = Slide.height();
    
    if(!data){
      create_empty_slide(app);
      return ;
    }
    
    var brush_margin = app.config() > 1 ? 20 : 0;
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
          .tickFormat(two_d? null : d3.format("s"));
    
    var xGrid = d3.svg.axis().scale(x)
        .orient("bottom").innerTickSize(height)
        .tickFormat(''),
      yGrid = d3.svg.axis().scale(y)
        .orient("right").innerTickSize(width)
        .tickFormat('');
		
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
        
    var defs = slide_selection.append("defs");
    defs.append("clipPath")
    .attr("id", clip_id)
      .append("rect")
        .attr("width", width)
        .attr("height", height);

    /** PNG images are grey scale. All positive and negative values are represented as unsigned 8-bit int.
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
      var svg_filter = defs.append("filter").attr("id", filter_id);
      svg_filter.append("feColorMatrix")
        .attr("type","matrix")
        .attr("values","1 0 0 0 0  0 0 0 0 0 1 0 0 0 0 0 0 0 1 0");
  
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
    
    //axes  and their labels
    slide_selection.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")");
      

    slide_selection.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + width + ",0)");
    
    slide_selection.append("g").classed('x grid', true);
    slide_selection.append("g").classed('y grid', true);
    
    slide_selection.append("text")
      .attr("class", "x axis-label")
      .attr("text-anchor", "middle")
      .attr("x", width/2)
      .attr("y", height)
      .attr("dy", "2.8em")
      .text("Chemical shift (ppm)");
    
    slide_selection.append("text")
      .attr("class", "y axis-label")
      .attr("text-anchor", "end")
      .attr("y", width)
      .attr("dy", "-.75em")
      .attr("transform", "rotate(-90)")
      .text("Intensity");
    
    dispatcher.on("redraw.slide", function (e) {
      if(e.x){
        slide_selection.select(".x.axis").call(xAxis);
        if(app.options('grid').x){
          slide_selection.select(".x.grid").call(xGrid);
        }
      }
      if(e.y){
        slide_selection.select(".y.axis").call(yAxis);
        if(app.options('grid').y){
          slide_selection.select(".y.grid").call(yGrid);
        }
      }
    });
    
    console.log("slide_init", data);
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
    if( app.config() > 1){
      require('./d1/scale-brush')()
        .xScale(x)
        .dispatcher(dispatcher)
        (Slide);
        
      require('./d1/scale-brush')()
        .yScale(y)
        .dispatcher(dispatcher)
        (Slide);
    }
    
    d3.rebind(Slide, spec_container, 'spectra', 'addSpec', 'changeRegion', 'range');
  }
  Slide.show = function (_) {
    if(svg_selection){
      svg_selection.classed('active', _);  
    }    
  };
  Slide.nd = function(){
    if (!data){
      return 0;
    }

    return two_d ? 2 : 1;
  };
  Slide.clipId = function(){
    return clip_id;
  };
  Slide.filterId = function(){
    return filter_id;
  };
  Slide.slideDispatcher = function(){
    return dispatcher;
  };
  Slide.specContainer = function(){
    return spec_container;
  };
  Slide.datum = function(_){
    if (!arguments.length) {return data;}
    if (_ !== undefined){
      data = check_data(_);
    }
    
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
    // #TODO: Actually, this is also called if the slide is not rendered.
    // In that case, svg_selection & parent_app are undefined.
    // To solve this, add specContainer on initialization.
    
    svg_selection.remove(); // remove the empty slide.
    Slide.datum(_)(parent_app);  // call the slide again with the data.
    if (parent_app.currentSlide() === Slide) { 
			Slide.show(true);
      // The new slide has a new nd, update the menu accordingly.
			parent_app.dispatcher().menuUpdate();
		}
  };
  return Slide;
};

function integrate(data){
  var _cumsum = data.map(function(d) { return d.y; }).cumsum();
  
  var ret = data.map(function(d,i){
    return {x:d.x, y:_cumsum[i]};
  });  
  return ret;
}

module.exports = function (){
  var core = require('../elem');
  var source = core.SVGElem().class('integration');
  core.inherit(IntegElem, source);
  
  var x, y, dispatcher, data;
  var svg_elem, path_elem, text_elem, path;
  var segment, integ_val, integ_factor, reduction_factor;
  
  
  function IntegElem(spec_line){
    function redrawPath() {      
      path_elem
        .datum(data)
        .attr("d", path);
      changeTextPos();
    }
    function changeTextPos() {
      var mid_p = path_elem.node()
        .getPointAtLength(0.5 * path_elem.node().getTotalLength());
  
      text_g.attr("transform", "translate("+ mid_p.x +","+ mid_p.y +")");
      changeText();
    }
    function changeText() {
      text_elem.datum(integ_val)
        .text((integ_val/integ_factor).toFixed(2));
      
      var bbox = text_elem.node().getBBox();
      //console.log(bbox, text_elem.text());
      text_elem.attr("dx", -bbox.width/2);
      
      redrawRect();
    }
    function redrawRect() {
      var bbox = text_elem.node().getBBox();
      //TODO: bbox is zero at rendering
      //console.log(bbox, text_elem.text());
      text_rect.attr("width", bbox.width +4)
        .attr("height", bbox.height +4)        
        .attr("x", bbox.x -2)
        .attr("y", bbox.y -2);
    }
    
    x = IntegElem.xScale();
    y = IntegElem.yScale();
    dispatcher = IntegElem.dispatcher();
    
    svg_elem = source(spec_line);
    IntegElem.updateData();
    if(!integ_factor){ integ_factor = integ_val; }
    if(!reduction_factor){ reduction_factor = 1; }
    
    
    path = d3.svg.line()
      .x(function(d) { return x(d.x); })
      .y(function(d) { return y(d.y/reduction_factor) - y.range()[0]*0.3; });
    
    
    path_elem = svg_elem.append("path")
      .attr("class", "line");
      
    var text_g = svg_elem.append("g")
      .attr("class", "integration-text");
      
    var text_rect = text_g.append("rect");
    
    text_elem = text_g.append("text");
    
    var modals = IntegElem.parentApp().modals();
    
    text_g.on("mouseenter", function () {
      svg_elem.classed("highlight", true);
    })
    .on("mouseleave", function () {
      svg_elem.classed("highlight", false);
    })
    .on("click", d3.contextMenu(
      [{
         title: 'Set integral',
         action: modals.input("Set Integral to: ",
          text_elem.text(),
           function (input) {
            integ_factor = text_elem.datum()/input;
            dispatcher.integ_refactor(integ_factor);
           }
         ),
       }]
    ));
  
    redrawPath();
    svg_elem.on("_redraw", function (e) {
      if(e.x){
        redrawPath();
      }
    })
    .on("_refactor", function (e) {
      IntegElem.integFactor(e);
      changeText();
    })
    .on('_reduction_factor', function (e) {
      IntegElem.reductionFactor(e);
      redrawPath();
    });
    
    // Register event listeners
    
    var dispatch_idx = ++dispatcher.idx;
    dispatcher.on("redraw.integ."+dispatch_idx, svg_elem.on("_redraw"));
    dispatcher.on("integ_refactor."+dispatch_idx, svg_elem.on("_refactor"));
    dispatcher.on("specDataChange.integ."+dispatch_idx, function (s) {
      if(s === IntegElem.parent()){
        if(integ_factor === integ_val){ // if the integral is equal to 1.00, keep it.
          IntegElem.updateData();
          integ_factor = integ_val;
          dispatcher.integ_refactor(integ_factor);
        }else{
          IntegElem.updateData();
        }        
      }
    });
  }
  
    
  IntegElem.segment = function (_) {
    if (!arguments.length) {return segment;}
    segment = _;
    
    return IntegElem.updateData();
  };
  IntegElem.updateData = function () {
    if (! (segment && svg_elem) ) { // not initialized or no segments.
      integ_val = undefined;
      return IntegElem;
    }
    
    var spec_line = IntegElem.parent();
    data = integrate (Array.prototype.slice.apply( spec_line.datum(), segment ) );
    integ_val = data[ data.length-1 ].y;
    
    return IntegElem;
  };
  IntegElem.integFactor = function (_) {
    if (!arguments.length) {return integ_factor;}
    integ_factor = _;
    
    return IntegElem;
  };
  IntegElem.integValue = function (_) {
    if (!arguments.length) {return integ_val;}
    integ_val = _;
    
    return IntegElem;
  };
  IntegElem.reductionFactor = function (_) {
    if (!arguments.length) {return reduction_factor;}
    reduction_factor = _;
    
    if (IntegElem.sel()){
      IntegElem.sel().on('_redraw')({x:true});
    }
    return IntegElem;
  };
  return IntegElem;
};

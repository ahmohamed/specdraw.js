
function inherit(target, source){
  for (var f in source){
    if (typeof source[f] === 'function'){
      //console.log(f);
      d3.rebind(target, source, f);
    }
  }
}

function ElemArray(arr){
  if(!arr){
    arr = [];
  }
  arr.nodes = function(){
    return this.map(function(e){return e.node();});
  };
  arr.sel = function(){
    return d3.selectAll(this.nodes());
  };
  return arr;
}

function Elem(tag){
  var selection, parentElem, width, height, cls;
  function _main (container){
    selection = container.append(tag || 'div');
    parentElem = container;
    if(cls){
      selection.classed(cls, true);
    }
    return selection;
  }
  
  _main.sel = function(){
    return selection;
  };
  _main.node = function(){
    return selection ? selection.node() : undefined;
  };
  _main.parent = function(){
    return parentElem ;
  };
  _main.width = function(_){
    if (!arguments.length) {return width;}
    width = _;
    return _main;
  };
  _main.height = function(_){
    if (!arguments.length) {return height;}
    height = _;
    return _main;
  };
  _main.class = function(_){
    if (!arguments.length) {return cls;}
    cls = _;
    return _main;
  };
  _main.append = function(_){ 
    if(!selection){
      throw new Error('Elem is not in DOM');
    }
    return selection.append(_);
  };
  _main.select = function(_){
    if(!selection){
      throw new Error('Elem is not in DOM');
    }
    return selection.select(_);
  };
  _main.selectAll = function(_){
    if(!selection){
      throw new Error('Elem is not in DOM');
    }
    return selection.selectAll(_);
  };
  _main.remove = function () {
    if( selection ){
      if ( selection.on('remove') ){
        selection.on('remove')();
      }
      selection.remove();
    }
  };
  _main.parentApp = function () {
    var _parent = parentElem;
    while(_parent){    
      if(typeof _parent.currentSlide === 'function'){
        return _parent;
      }
      _parent = _parent.parent ? _parent.parent() : null;
    }
    return null;
  };
  return _main;
}

function ResponsiveElem(tag){
  var source = Elem(tag);
  var x, y, data, dispatcher;
  function _main (container){
    var selection = source(container);
    return selection;
  }
  _main.xScale = function(_){
    if (!arguments.length) {return x;}
    x = _;
    return _main;
  };
  _main.yScale = function(_){
    if (!arguments.length) {return y;}
    y = _;
    return _main;
  };
  _main.datum = function(_){
    if (!arguments.length) {return data;}
    data = _;
    return _main;
  };
  _main.dispatcher = function(_) {
    if (!arguments.length) {return dispatcher;}
    dispatcher = _;
    return _main;
  };  
  inherit(_main, source);
  return _main;
}

function SVGElem(){
  var source = ResponsiveElem('g');
  function _main (container){
    var selection = source(container);
    return selection;
  }
  inherit(_main, source);
  return _main;
}

module.exports.inherit = inherit;
module.exports.ElemArray = ElemArray;
module.exports.Elem = Elem;
module.exports.ResponsiveElem = ResponsiveElem;
module.exports.SVGElem = SVGElem;

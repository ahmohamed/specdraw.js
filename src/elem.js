function inherit(target, source){
  for (f in source){
    if (typeof source[f] === 'function'){
      d3.rebind(target, source, f)
    }
  }
}

function ElemArray(arr){
	if(!arr){
		arr = [];
	}
  arr.__proto__.nodes = function(){
	  return this.map(function(e){return e.node()});
	}
	
  return arr;
}

function Elem(tag){
  var selection, width, height, cls;
  function _main (container){
    selection = container.append(tag || 'div');
    if(cls){
      selection.classed(cls, true);
    }
    return selection;
  }
	
  _main.sel = function(){
    return selection;
  }
  _main.node = function(){
    return selection ? selection.node() : undefined;
  }
  _main.width = function(_){
    if (!arguments.length) return width;
    width = _;
    return _main;
  };
  _main.height = function(_){
    if (!arguments.length) return height;
    height = _;
    return _main;
  };
	_main.class = function(_){
    if (!arguments.length) return cls;
    cls = _;
    return _main;
  };
	_main.append = function(_){ 
		if(!selection){
			throw new Error('Elem is not in DOM')
		}
		return selection.append(_);
	};
	_main.select = function(_){
		if(!selection){
			throw new Error('Elem is not in DOM')
		}
		return selection.select(_);
	};
	_main.selectAll = function(_){
		if(!selection){
			throw new Error('Elem is not in DOM')
		}
		return selection.selectAll(_)
	};
  return _main;
}

function SVGElem(){
	var source = Elem('g');
  var x, y, data, dispatcher;
  function _main (container){
    var selection = source(container);
    return selection;
  }
  _main.xScale = function(_){
    if (!arguments.length) return x;
    x = _;
    return _main;
  };
  _main.yScale = function(_){
    if (!arguments.length) return y;
    y = _;
    return _main;
  };
  _main.datum = function(_){
    if (!arguments.length) return data;
    data = _;
    return _main;
  };
  _main.dispatcher = function(_) {
  	if (!arguments.length) return dispatcher;
  	dispatcher = _;
  	return _main;
  };	
	inherit(_main, source);
  return _main;
}

module.exports.inherit = inherit;
module.exports.ElemArray = ElemArray;
module.exports.Elem = Elem;
module.exports.SVGElem = SVGElem;

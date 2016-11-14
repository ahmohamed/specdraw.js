module.exports = function (node) {
  var clientwidth = node.clientWidth,
  clientheight = node.clientHeight;
  
  var br_width, br_height;
  if(typeof node.getBoundingClientRect === 'function'){
    br_width = node.getBoundingClientRect().width;
    br_height = node.getBoundingClientRect().height;
  }
  var cs_width, cs_height;
  if(typeof getComputedStyle === 'function'){
    var rect = getBoundingRect(node);
    cs_width = rect.width;
    cs_height = rect.height;
  }
  var width = d3.min([clientwidth, br_width, cs_width]),
    height = d3.min([clientheight, br_height, cs_height]);
  
  return [width, height];
};

function getBoundingRect(element) {

    var style = window.getComputedStyle(element); 
    var margin = {
        left: parseInt(style["margin-left"]),
        right: parseInt(style["margin-right"]),
        top: parseInt(style["margin-top"]),
        bottom: parseInt(style["margin-bottom"])
    };
    var padding = {
        left: parseInt(style["padding-left"]),
        right: parseInt(style["padding-right"]),
        top: parseInt(style["padding-top"]),
        bottom: parseInt(style["padding-bottom"])
    };
    var border = {
        left: parseInt(style["border-left"]),
        right: parseInt(style["border-right"]),
        top: parseInt(style["border-top"]),
        bottom: parseInt(style["border-bottom"])
    };
    
    
    var rect = element.getBoundingClientRect();
    rect = {
      left: rect.left - margin.left,
      right: rect.right - border.right,
      top: rect.top - margin.top,
      bottom: rect.bottom - border.bottom - border.top
    };
    rect.width = rect.right - rect.left;
    rect.height = rect.bottom - rect.top;
    return rect;
    
};
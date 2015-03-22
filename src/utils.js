var whichMax = function (arr) {
	if (arr.length === 1)
		return 0;
	
  var max = arr[0].y;
  var maxIndex = 0;
  
  for (var i = 1; i < arr.length; i++) {
    if (arr[i].y > max) {
      maxIndex = i;
      max = arr[i].y;
    }
  }
  return maxIndex;
};

var sliceData = function(data, domain, range){
  var datalen = data.length*(domain[0] - domain[1])/(range[0]-range[1]);

  var dataResamplestart = data.length*(domain[0] - range[0])/(range[1]-range[0]);
  return {start:dataResamplestart, end:dataResamplestart+datalen};	
}

var resample = function (data, domain, npoints) {
  var dataResample = simplify(data, (domain[0] - domain[1])/npoints);
  
	return dataResample;
};

var cumsum = function (a) {
	for (var _cumsum = [a[0]], i = 0, l = a.length-1; i<l; i++) 
	    _cumsum[i+1] = _cumsum[i] + a[i+1]; 
	
	return _cumsum;
};

var disable = function (svg) {
	svg_width = svg.attr("width");    svg_height = svg.attr("height");
	
	// overlay rectangle to prevent mouse events.
	svg.append("svg:foreignObject")
		.attr("class", "disable")
		.attr("width", svg_width)
		.attr("height", svg_height)
		.style('pointer-events', 'all')
		.append("xhtml:div")
		.style({
      "width": svg_width+"px",
			"height": svg_height+"px",
			"background": "black",
			"opacity":0.5
		});			
};

		
var applyCSS = function (ccs_file) {
	d3.select("head").append("link")
		.attr({
			"rel":"stylesheet",
			"type":"text/css",
			"href":ccs_file
		});
};


var saveSVG = function (svg) {
	svgAsDataUri (svg.node(), {}, function(uri) {
	  var a = document.createElement("a");
	    a.download = "spec.svg";
	    a.href = uri;
	    a.setAttribute("data-downloadurl", uri);
	    a.click();    
	});	
};

var savePNG = function (svg, filename) {
	saveSvgAsPng(svg.node(), filename)
};

/* Use characters as cursor.
$(function() {
    var canvas = document.createElement("canvas");
    canvas.width = 24;
    canvas.height = 24;
    //document.body.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.font = "24px FontAwesome";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("\uf002", 12, 12);
    var dataURL = canvas.toDataURL('image/png')
    $('body').css('cursor', 'url('+dataURL+'), auto');
});
*/
//<a onclick='saveSvgAsPng(document.getElementById("svg"), "svg.png")'>any</a>

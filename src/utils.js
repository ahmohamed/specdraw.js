var setCookie = function(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
};
var getCookie = function(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1);
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
};
var checkCookie = function() {
  var user = getCookie("username");
  if (user != "") {
    alert("Welcome again " + user);
  } else {
    user = prompt("Please enter your name:", "");
    if (user != "" && user != null) {
      setCookie("username", user, 365);
    }
  }
};
Array.prototype.subset =function(arr){
	var ret = [];
	for (var i = arr.length - 1; i >= 0; i--)
		ret.push(this[arr[i]]);
	
	return ret;
};
Array.prototype.rotate =function(reverse){
  if(reverse)
    this.push(this.shift());
  else
    this.unshift(this.pop());
  return this;
};
Array.prototype.rotateTo =function(val){
  while(this[0] !== val){
		this.rotate();
  }
  return this;
};
d3.selection.prototype.selectP =function(name){
	var parent = this.node().parentNode;
	while(parent){       
		if(name.toUpperCase() === parent.tagName.toUpperCase() || //tagname
			name.toUpperCase() === "#"+parent.id.toUpperCase() || //id
			name.toUpperCase() === "."+parent.class.toUpperCase()) //class
				return d3.select(parent);

		parent = parent.parentNode;
	}
	return null;
};
d3.selection.prototype.toggleClass = function(class_name){
	return this.classed(class_name, !this.classed(class_name));
};
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
d3.selection.prototype.size = function() {
  var n = 0;
  this.each(function() { ++n; });
  return n;
};
var sliceDataIdx = function(data, domain, range){
  var datalen = data.length*(domain[0] - domain[1])/(range[0]-range[1]);

  var dataResamplestart = data.length*(domain[0] - range[0])/(range[1]-range[0]);
  return {start:dataResamplestart, end:dataResamplestart+datalen};	
}

var getSlicedData = function (data, domain, range) {
	var slice_idx = sliceDataIdx(data, domain, range);
	return data.slice(slice_idx.start, slice_idx.end);
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

var applyCSS2 = function () {
	var style = "svg{font:10px sans-serif}.crosshair circle{fill:none;stroke:#4682b4}.line{stroke:#4682b4;stroke-width:1;fill:none;shape-rendering:optimizeSpeed;-webkit-svg-shadow:0 0 7px #53BE12;-webkit-filter:drop-shadow(5px -5px 5px #000);filter:drop-shadow(50px 50px 5px #000)}.line.highlighted{stroke:green}.line.selected{stroke:red;stroke-width:2}.integration .line{stroke:green}.segment{stroke:green;stroke-width:3;fill:none;shape-rendering:optimizeSpeed}.integration-text rect{fill:#fff;stroke:green;opacity:.7}.integration .highlight{stroke:red}.axis line,.axis path{fill:none;stroke:#000;shape-rendering:crispEdges}.extent{stroke:#000;fill:#69f;fill-opacity:.3;shape-rendering:crispEdges}.peakpick-brush{display:none}.peakdel-brush .extent{fill:#f69}.integrate-brush .extent{fill:#6f9}.scale-brush .brush-axis .domain{stroke:#ccc;stroke-width:8px;stroke-linecap:round}:focus{outline:#000 1}.background{fill:#000}.all-panels text{font-size:10px}.d3-context-menu{position:absolute;display:none;background-color:#f2f2f2;border-radius:4px;font:14px FontAwesome;min-width:150px;border:1px solid #d4d4d4;z-index:1200}.d3-context-menu ul{list-style-type:none;margin:4px 0;padding:0;cursor:default}.d3-context-menu ul li{padding:4px 16px}.d3-context-menu ul li:hover{background-color:#4677f8;color:#fefefe}.nanoModalContent input:invalid{background:red}input:focus:invalid,input:required:invalid{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAeVJREFUeNqkU01oE1EQ/mazSTdRmqSxLVSJVKU9RYoHD8WfHr16kh5EFA8eSy6hXrwUPBSKZ6E9V1CU4tGf0DZWDEQrGkhprRDbCvlpavan3ezu+LLSUnADLZnHwHvzmJlvvpkhZkY7IqFNaTuAfPhhP/8Uo87SGSaDsP27hgYM/lUpy6lHdqsAtM+BPfvqKp3ufYKwcgmWCug6oKmrrG3PoaqngWjdd/922hOBs5C/jJA6x7AiUt8VYVUAVQXXShfIqCYRMZO8/N1N+B8H1sOUwivpSUSVCJ2MAjtVwBAIdv+AQkHQqbOgc+fBvorjyQENDcch16/BtkQdAlC4E6jrYHGgGU18Io3gmhzJuwub6/fQJYNi/YBpCifhbDaAPXFvCBVxXbvfbNGFeN8DkjogWAd8DljV3KRutcEAeHMN/HXZ4p9bhncJHCyhNx52R0Kv/XNuQvYBnM+CP7xddXL5KaJw0TMAF8qjnMvegeK/SLHubhpKDKIrJDlvXoMX3y9xcSMZyBQ+tpyk5hzsa2Ns7LGdfWdbL6fZvHn92d7dgROH/730YBLtiZmEdGPkFnhX4kxmjVe2xgPfCtrRd6GHRtEh9zsL8xVe+pwSzj+OtwvletZZ/wLeKD71L+ZeHHWZ/gowABkp7AwwnEjFAAAAAElFTkSuQmCC);background-position:right top;background-repeat:no-repeat;-moz-box-shadow:none}input::-webkit-inner-spin-button,input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}.div-menu .nav,.div-menu .nav a,.div-menu .nav div,.div-menu .nav form,.div-menu .nav input,.div-menu .nav li,.div-menu .nav ul,.div-menu a{margin:0;padding:0;border:none;outline:0}.div-menu .nav a,.div-menu a{text-decoration:none}.div-menu .nav li{list-style:none}.div-menu>.nav{display:inline-block;position:relative;cursor:default;z-index:500}.div-menu .open-menu{text-align:center;background:#4682b4;float:left;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#fcfcfc;text-shadow:0 0 1px rgba(0,0,0,.35)}.div-menu .nav>li{display:block;float:left}.div-menu .nav>li>a{position:relative;display:block;z-index:510;padding:0 10px;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#fcfcfc;text-shadow:0 0 1px rgba(0,0,0,.35);background:#4682b4;-webkit-transition:all .3s ease;-moz-transition:all .3s ease;-o-transition:all .3s ease;-ms-transition:all .3s ease;transition:all .3s ease}.div-menu .nav>li:hover>a{background:#98AFC7}.div-menu .nav>li:first-child>a{border-radius:5px 0 0 5px}.div-menu .nav>li:last-child>a{border-radius:0 5px 5px 0}.div-menu .nav>li>div,.nav-column>li>div{position:absolute;top:100%;display:block;opacity:0;visibility:hidden;overflow:hidden;white-space:nowrap;background:#98AFC7;border-radius:0 0 3px 3px;-webkit-transition:all .3s ease .15s;-moz-transition:all .3s ease .15s;-o-transition:all .3s ease .15s;-ms-transition:all .3s ease .15s;transition:all .3s ease .15s}.div-menu .nav>li:hover>div,.nav-column>li:hover>div{opacity:1;visibility:visible;overflow:visible}.div-menu .nav-column>li>div{top:0;left:100%}.div-menu .nav .nav-column{float:left}.div-menu .nav .nav-column li a{font-family:Helvetica,Arial,sans-serif;font-size:13px;padding:0 2px 0 10px;color:#000}.div-menu .nav .nav-column li a:hover{background:#889FB7}.div-menu .nav-column li>a{display:flex;justify-content:space-between;overflow-x:auto}.div-menu .nav-column li a{flex-shrink:0;white-space:nowrap}.all-panels .peaks patha{display:none}";
	d3.select("head").insert("style", ":first-child")
	.attr({
		"type":"text/css",
	})
		.text(style);
		
	console.log("style", d3.select("head").select("style"))
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
var drawTrace = function (svg, data, xdomain) {
	
}


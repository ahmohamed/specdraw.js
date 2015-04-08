(function () { "use strict";
  var spec = {version: "0.5.1"}; // semver
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

var events = {
	crosshair:true,
	peakpick:false,
	peakdel:false,
	integrate:false,
	zoom:["x", "y", false]
}

events.crosshairToggle = function () {
	events.crosshair = !events.crosshair;
	dispatcher.crosshairEnable(events.crosshair);
}

events.peakpickToggle = function () {
	if(events.zoom[0] !== false)	events.zoom.rotateTo(false);	
	if(events.peakdel !== false)	events.peakdelToggle();
	if(events.integrate !== false)	events.integrateToggle();
	
	console.log(events.zoom)
	events.peakpick = !events.peakpick;
	dispatcher.peakpickEnable(events.peakpick);
}

events.peakdelToggle = function () {
	if(events.zoom[0] !== false)	events.zoom.rotateTo(false);	
	if(events.peakpick !== false)	events.peakpickToggle();
	if(events.integrate !== false)	events.integrateToggle();	
	
	events.peakdel = !events.peakdel;
	dispatcher.peakdelEnable(events.peakdel);	
}

events.integrateToggle = function () {
	if(events.zoom[0] !== false)	events.zoom.rotateTo(false);	
	if(events.peakpick !== false)	events.peakpickToggle();
	if(events.peakdel !== false) events.peakdelToggle();

	events.integrate = !events.integrate;
	dispatcher.integrateEnable(events.integrate);	
}

events.zoomToggle = function () {
	if(events.peakpick !== false)	events.peakpickToggle();
	if(events.peakdel !== false)	events.peakdelToggle();
	if(events.integrate !== false)	events.integrateToggle();	
	
	events.zoom.rotate();
	console.log(events.zoom)
	//dispatcher.integrateEnable(events.integrate);	
}

var cursor = {
	addinteg:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABtElEQVRIS62WzStFQRiHzy3lc3MX/AWSj0KhlCV7xEJRStn42MgCC7KxsxEWipSNugvKSsrCzldRilIiSlkgVpKP59VM3cY5576nc6aezjkz7/x+M/POzL0pz7+0Ub3nNI3zPR8QH1id8mkppu4I7mASzkxMYgbtCG7DMCxDLVTBATwmMYMlRIZgBOQ9VnGXSL4z0AWtsB9Lnc6uQRF1x1ANjXCqNOgkrgUW4Ta7j2tQQOOhWfcmnidKg1XiBuBfH9eglKALKPMLDjFboG1UY1BJ0KURijIDtUE54tcxDOrpex6WA41BMwKFRuSH5yesmI0xZnKYb03cHFiDdwIasmZj4+WU35gcqfIfZPBA7xp4c1Ty+J6ANHyYNtGQOilybmQX2pIOMngiQhL+ohqm59kk58xBB4JbENXAXi85z0E34nJVyDrLaCQXmqLeptZgE9Ve+NaoExN5Bjt0kvvlS2kwS9y0mXXoOegjaAPsb4FSPzhMdtE9zMAarEM/VIA90bFMxEBOo+yaKZgDWZ5BUx9LXDpbAyu0y0sPvMZWNgJiUAcl8AxXSY3cDtDvX0VSg//T+QW01FzwK6wJAwAAAABJRU5ErkJggg==",
	delinteg:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABdklEQVRIS92VzysFURiG50p+b2z8AbJANgqFnX8AJRsLq0uRNWUlCxZWxIqUFbFTdspCKFcksVC6ko2NHSvyvDWndJw7c7ozs3Hqaeac+c77znfmO2dyQXybI2TJCuuhfxk/NQhyMUFtPL+HebiGozC+j+t5GgbLiMxCJ9zAANTDMXwkNahB4AraoRcufATtmKglaiS4AA3QBS9pG7Qi+ABvoPv3tA1aEHzM0qAf8dMsDUYR38vSYATx/X9h8EQWHfBpVVElfR0jddZ4Nf01KGo8ah+YJdolbgy+LSHtaJk3OcpXBXLma3BI4JDDQPObocKR2bPJOCqDVYJmQAbD8OV409ihKIN1Zk/BFkyUyCCRgckgj8pmrFKJAJ8lmmbuRtoGMt6GcegGnaplNZOBrvprTcIg6BS9CxVde8DbzBiopm9BZacfywGshBnseKs5Ao2BduUJaIOYtsDNIpRVnkbk90euZVDLUQWvUEzy5i6DNPT+aPwAle1IGSTahDYAAAAASUVORK5CYII=",
	peakpick:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABxUlEQVRIS+2VPSiFURjH7yUxyEdJiUlZpJgpg0kWBiQyGBhIKZtFhI1BSFFSlI+BmGQjMSgMRkpmZSCR8Ptzzu24rvc96t7NW7/e857znOd/nuc857zRSIqfaIr9R/4FQjPspqgA60Z4dGZl0z6H01BPkUgZNrVwApfW3hXIp7MV5h1nk7SX3AkBQh2MrcAgTCUSsH3TNPrhGsrh2WP1MmmGTeiDuSCBdgZXYRea4C3ZAnYlazhW2L4C2r9t6IbFoAisQFAERTjIdSJTGhX5GMyYPcjUeKKDFiagOYpOBRH6BAkEpWgAzw1w5yjU0S403xs2tfEC+l6GTlAVVcJD6DK/DLyqqATDW8dhFe2LZAp04awHdmACvh2aEKHQCDJwcAQqsX2TIqWpAp48oggVqDYCpbxv4ABqoB72PARasNHmKgML1t5ust465qpnbbAOlz3RvlGkMyfL+HiNF9BmnoFuw0MzmGP6FNEoDHtE8cNEK08z6dCqVcsxddq6i7bMrBHe2viXvwhJYBZ6QXtwnGDyEH3jTr8i0TXu/jd+1ZTAO7TBesDKdAXrjrGPKiv2UwmKSAJ5cO8Rtn5IxaCSvfKw/zT5AMjqYuejWwg8AAAAAElFTkSuQmCC",
	peakdel:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABqElEQVRIS+2VTShFQRiG3URC5GdjJ1HyU6wsiLtRliwtpPwtiNTNhlIWKBtFrMjKz0axUJRS7CyQUjayQIpYoFCK583cOumcOffo3mycevrmznznfeebmTM3lJTgJ5Rg/aR/A98V9lqiSt6sgReHQgbtbbjxVXUkeBkUk9MGo47cQdqrcBcPA2mkwAmUwSJ0BRGO5tpOkcaWoB36YD7eBtKbgf6/NmhkAutwCqmmymTiPkT8PrRYKmhFaMVl+Q7oC/sZzJHUC92w4LEHmm2my9g7fW82gywSjqHInCKZfAbdaJtBGLE9I3hNLIeneBnIeA0knA2dUA9a10CPVwWFqFxCFai9AbMwEEidZC8DXQs6/6WQB7fwbJbpKoiJm0EOAucwAjo5ylHs+E0VerkEcuEQdEokNAkVcG9mW008Mu0m4k6sVcjgAnQUtRwPRlSzn/ghMsXvIdPXQtw0E7J6yeAMdGOOQYNpO2cfFUijsQu1pkPXdgSWbUYyGIZx85I2sg50r7g96XROQ48Z3CI2w4dXGdFNLiBBF5Vm9Wqt+XtQ+fnwCNZ/uC/qOUsdSEVD5wAAAABJRU5ErkJggg==",
	refpick:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAB9klEQVRIS+WVTSilURjHWdBEkY+NnUQmH0UW1AgLCwsLylaKWJhIyYIpJRmRKEKJKImyMBYWPmJhITNCysdGFkiZxgJRZur6/afz6nW7133v7Vo59es599znPP/nfD1vaMg7t9AA42veVxiCVTiFUuiDUXiy4gYqoPmaOw8rMAZRsAUjMBwMAcWYgG2bwB79TpgKlsAggfJgGtTvhS649Vcgkwm5cG9NxEZCMRxCHFRAKjzYfP7vo5OWjFMltNucm+jnwKbZkh3skfH75+8K5B8G+5AG2vtaWIdZ0CF/hmNohv5ABLTaSagCXdG/JvAvbAPosMtgAVqhB1xOt8hKSAepYBLQdfTZPp6AXmi9OeBxn/uDgz9bpFKgl5oE1i1y+RLxR6CIYBsm4AU2HV5erDchpwLymwMFjoYaKAA9sjebU4FEopxBFqj/A1SqG4MloLKg+6/XqrpzBXdmm87fEnGyghgCnMA30M3RHNlqJ6vwJJDCxFj4CbolCtQNGfDbZJuN3TX9Euyyt1W4C3zCUeVXV1Hb8ccEVfbf3YKo9reYsXLsoknolZu7QAT/qnipYnZAoenbs7cCKJk1+GIGrrGqpDN2IU9b1IaDvkpqOsh8OHDL3vqphAagzgwsYVVRfX4PEnAKB2X16CW4fVj+8XADl/Y/ngGM/GMZMjMjNAAAAABJRU5ErkJggg==",
	
}
// Event dispatcher to group all listeners in one place.
var dispatcher = d3.dispatch(
	"rangechange", "regionchange", "regionfull", "redraw",  	//redrawing events
	"mouseenter", "mouseleave", "mousemove", "click", 	//mouse events
	"keyboard",																//Keyboard
	"peakpickEnable", "peakdelEnable", "peakpick", "peakdel",		//Peak picking events
	"integrateEnable", "integrate", "integ_refactor",						//Integration events
	"crosshairEnable",
	"blindregion",
	"log"
);

var registerKeyboard = function(){

	d3.select("body").on("keydown", function() {
      /*svg.append("text")
          .attr("x","5")
          .attr("y","150")
          .style("font-size","50px")
          .text("keyCode: " + d3.event.keyCode)  
        .transition().duration(2000)
          .style("font-size","5px")
          .style("fill-opacity",".1")
	        .remove();
			*/
			dispatcher.log("keyCode: " + d3.event.keyCode);
			
			if (d3.event.keyCode===80) { // p
				events.peakpickToggle();
			}else if (d3.event.keyCode===68) { // d
				events.peakdelToggle();
			}else if (d3.event.keyCode===73) { // i
				events.integrateToggle();
			}else if (d3.event.keyCode===67) { // c
				events.crosshairToggle();
			}else if (d3.event.keyCode===70) { // f
				dispatcher.regionfull();
			}else if (d3.event.keyCode===90) { // f
				events.zoomToggle();
			}
			
			
			dispatcher.keyboard(d3.event);
	  });
}

/* opens a dialogue to edit svg text
 * to be used for integration.
function editText(evt){
	// fetch the DOM element where the click event occurred
	var textElement = evt.target;
	// fetch current text contents and place them in a prompt dialog
	var editedText = prompt("Edit textual contents:", textElement.firstChild.data);
	// only replace text if user didn't press cancel
	if(editedText != null){
		textElement.firstChild.data = editedText;
	}
}*/

var modals = {
	crosshair:true,
	peakpick:false,
	peakdel:false,
	integrate:false,	
}

modals.proto = function (content, ok_fun, cancel_fun) {
	var nano = nanoModal(content,{
		overlayClose: false,
		buttons: [
			{
		    text: "OK",
		    handler: ok_fun,
		    primary: true
			}, 
			{
		    text: "Cancel",
		    handler: cancel_fun? cancel_fun : "hide",
				classes:"cancelBtn"
			}
		]
	});
	
	d3.select(nano.modal.el).on("keydown", function() {
		if (d3.event.keyCode===13) { // Enter
			d3.select(nano.modal.el).select(".nanoModalBtnPrimary").node().click();
		}
		if (d3.event.keyCode===27) { // Escape
			d3.select(nano.modal.el).select(".cancelBtn").node().click();
		}
	})
	
	nano.onShow(function () {
		d3.select(nano.modal.el).select(".cancelBtn").node().focus();
	});
	return nano;
}
modals.range = function (text, _range, callback, _curr_val){
	var range;
	if(_range[0]>_range[1])
		range = [_range[1], _range[0]];
	else{
		range = _range;
	}
	range = [d3.round(range[0],3), d3.round(range[1],3)];
	
	if(typeof _curr_val === 'undefined'){
		_curr_val = range;
	}else{
		if(_curr_val[0]>_curr_val[1])
			_curr_val = [_curr_val[1], _curr_val[0]];
		
		_curr_val = [d3.round(_curr_val[0],3), d3.round(_curr_val[1],3)];
	}
	
	var content = text +
		'<input type="number" id="range0" step="0.001" value='+_curr_val[0]+ ' min='+ range[0] + ' max='+ range[1] +'>' +
		' - ' +
		'<input type="number" id="range1" step="0.001" value='+_curr_val[1]+ ' min='+ range[0] + ' max='+ range[1] +'>';
		
	var nano = modals.proto(content,
		function(modal) {
			modal.hide();
      var input_range = d3.select(modal.modal.el)
				.selectAll("input")[0].map(function(e){ return +e.value; });
			
			if (input_range[0] < range[0] || input_range[0] > range[1]
				|| input_range[1] < range[0] || input_range[1] > range[1]
				|| input_range[0] > input_range[1])
				nanoModal("Invalid input."+input_range).show();
			else{
				if(_range[0]>_range[1])
					callback(input_range.reverse());
				else{
					callback(input_range);
				}
			}
    });
	
	return nano.show;	
};

modals.input = function (text, value,callback){	
	var content = text +
		'<input type="number" id="input0" step="0.001" value='+value+'>';
		
	var nano = modals.proto(content,
		function(modal) {
			modal.hide();
      var input = d3.select(modal.modal.el)
				.select("input").node().value;
			callback(input);
    });
	
	return nano.show;	
};

modals.xRegion = function () {
	modals.range(
		"Set x region to:\n",
		d3.select(".main-focus").node().range.x,
		function (new_range) { d3.select(".main-focus").on("_regionchange")({xdomain:new_range}); },
		d3.select(".main-focus").node().xScale.domain()
	)();
};

modals.yRegion = function () {
	modals.range(
		"Set y region to:\n",
		d3.select(".main-focus").node().range.y,
		function (new_range) { d3.select(".main-focus").on("_regionchange")({ydomain:new_range}); },
		d3.select(".main-focus").node().yScale.domain()
	)();
};

modals.slider = function (text, value, callback){	
	var content = text +
		'<input id="slider" type="range" min="-5" max="5" value="0" step="0.001"/>';
		
	var nano = modals.proto(content,
		function(modal) {
			modal.hide();
    },
		function (modal) {
			callback(0);
		});
	
	d3.select(nano.modal.el).select("#slider")
		.on("input", function(){
	    callback(+this.value);
		});
	
	return nano.show;	
};

modals.scaleLine = function () {
	modals.slider(
		"Scale spectrum by a factor:",
		0,function (value) {
			d3.select(".selected").node().setScaleFactor(Math.pow(2,value));
		}	
	)();
};spec.menu = function(){
	var svg_elem, x, y, menu_on=false;
	
	function _main(svg) {
		function css_trans(transform){
		  return function(svg){
		    svg.style({
		      "transform": transform,
		      "-webkit-transform":transform,
		      "-moz-transform":transform,
		      "-o-transform":transform
		    });
		  }
		}
		function toggle() {
		  if(!menu_on){
				button.text("✖").on("click",null)
			  nav.style("overflow-y","visible")
				
				d3.select(".all-panels")
					.transition().duration(500)
					.attrTween("transform",function(){
				 	return function(t){
	          nav.call(css_trans("translateX("+ (-width+t*width) + "px)"));
	          button.call(css_trans("translateY("+ t*height + "px)"));
				    return "translate(0,"+ t*height+")";
				 	}
				}).each("end", function(){
	        button.on("click", toggle);
					div_menu.style("overflow", "visible");
	        menu_on = true;
	      });    
		  }else{
		    button.text("☰").on("click",null);    
				nav.style("overflow-y","hidden");
				
		    d3.select(".all-panels")
					.transition().duration(500)
					.attrTween("transform",function(){
					 	return function(t){
		          nav.style("max-height", (height-t*height) +"px");
		          button.call(css_trans("translateY("+ (height-t*height) + "px)"));
					    return "translate(0,"+ (height-t*height) +")";
					 	}
					})
		    .each("end", function(){
		      	div_menu.style("overflow", "hidden");
		      	nav
							.style("max-height","none")
		          .call(css_trans("translate("+ (-width) + "px,0px)"));
		        button.on("click", toggle);
		        menu_on = false;
		    	});
		  }
  
		}
		
		
		var width = svg.attr("width"),
				height = 25;
	
	
		svg_elem = svg.append("g")
			.attr("class", "all-menu");

		var div_menu = svg_elem.append("svg:foreignObject")
			.attr("width", height)
			.attr("height", height)
			.style('pointer-events', 'all')
			.append("xhtml:div")
			.attr("class", "div-menu")
			.style({
        "width": width+"px",
				"height": height*2+"px",
				"vertical-align": "middle",
				"line-height": height+"px",
				"overflow": "hidden",
				"color": "white"
			});
			
			

		var button = div_menu.append("xhtml:a")
			.style("width", height+"px")			
			.attr("class", "open-menu")
		  .attr("href", "#")
			.text("☰")
			.on("click", toggle);
 

		var menu = 
			[
			  {
			    name:"Peaks",
			    fun:function(){},
			    children:[
			      {
							name:"Pick peaks",fun:function(){},
							children:[
								{name:"Manual peak picking",fun:events.peakpickToggle},
							  {
									name:"Automatic using threshold",
									fun: function () {
										d3.select(".main-focus").node().getThreshold(
												function (t) { pro.pp("threshold", t); }
										);									
							  	}
								},
							  {
									name:"Peak segments using threshold",
									fun: function () {
										d3.select(".main-focus").node().getThreshold(
												function (t) { pro.pp("threshold", t, true); }
										);
							  	}
								},
							  {
									name:"Automatic using CWT",
									fun: function () {
										pro.pp("cwt");
							  	}
								},								
							]
						},
			  		{name:"View/manage peak table",fun:null},
						{name:"Delete peaks",fun:events.peakdelToggle},
    			]
			  },
				{
					name:"Baseline",
					fun:function(){},
					children:[
						{name:"Constant baseline correction",fun:function(){pro.bl("cbf")} },
						{name:"Median baseline correction",fun:function(){pro.bl("med")} },
					],
				},
				{
					name:"View",
					fun:function(){},
					children:[
						{
							name:"Change region",fun:modals.xRegion,
							children:[
								{name:"Set X region",fun:modals.xRegion},
								{name:"Set Y region",fun:modals.yRegion},
								{name:"Full spectrum",fun:dispatcher.regionfull,
									children:[{name:"Set X region",fun:modals.xRegion},]
								},
							]
						},
					],
				},
			  {
					name:"Integration",
					fun:events.integrateToggle,
				},
			  {name:"crosshair",fun:events.crosshairToggle},
			  {name:"Selected",fun:function(){},
					children:[
						{name:"Scale",fun:modals.scaleLine},
					]
				},
				{
					name:"Export",
					fun:function(){},
					children:[
						{name:"As PNG",fun:function(){
							setTimeout(function(){savePNG(svg.selectP("svg"), "specdraw.png")},500);
						}},
						{name:"As SVG",fun:function(){
							setTimeout(function(){saveSVG(svg.selectP("svg"), "specdraw.svg")},500);
						}},
						{name:"CSV",fun: function(){}},
						{name:"Peak table",fun:function(){}},
						{name:"JCAMP-DX",fun:function(){}},
					],
				},
			];
			
			var nav = div_menu.append("ul")
				.attr("class","nav")
				.style("overflow-y","hidden")
				.call(css_trans("translateX("+ (-width) + "px)"));

			var first = nav.selectAll("li").data(menu);
				
			first.enter()
				.append("li")
					.append("a")
					.text(function(d){return d.name+ (d.children?" ▼":"");})
					.attr("href", "#")
					.on("click", function(d){toggle(); d.fun();});

			arr2el(first, function (_sel) {
				var ret = _sel.append("div").append("ul").attr("class", "nav-column")
					.selectAll("li").data(function(d){return d.children});
				
				ret.enter()
				  .append("li")
						.append("a")
						.text(function(d){return d.name;})
						.attr("href", "#")
						.on("click", function(d){toggle(); d.fun();})
						.append("a")
						.text(function(d){return (d.children?" ▶":"")});
				
				return ret;
			});
			
		return svg_elem;									
	}
	
	function arr2el(sel, fun){
		var second = fun(sel.filter(function(d){return d.children;}));
		
		console.log(second.filter(function(d){return d.children;}).size());
			if(second.filter(function(d){return d.children;}).size() > 0)
				arr2el(second, fun);
	}
  _main.xScale = function(_){
    if (!arguments.length) return x;
    x = _;
    return _main;
  }

  _main.yScale = function(_){
    if (!arguments.length) return y;
    y = _;
    return _main;
  }
	
	return _main;
};
spec.d1 = {};
spec.d1.threshold = function () {
	var svg_elem, x, y, dispatcher, callback;
	function _main(svg) {
		svg_elem = svg.append("path")
			.attr("class", "threshold line x")
			.on("_mousemove", function(e) {
				svg_elem.attr("d", d3.svg.line()([[x.range()[0], e.ycoor], [x.range()[1], e.ycoor]]));
			})
			.on("_click", function (e) {
				callback(y.invert(e.ycoor));
				svg_elem.remove();
				dispatcher.on("mousemove.thresh."+dispatch_idx, null);	
				dispatcher.on("click.thresh."+dispatch_idx, null);
			});
		
		var dispatch_idx = ++d3.select(".main-focus").node().dispatch_idx;
		dispatcher.on("mousemove.thresh."+dispatch_idx, svg_elem.on("_mousemove"));	
		dispatcher.on("click.thresh."+dispatch_idx, svg_elem.on("_click"));
	}

  _main.callback = function(_) {
  	if (!arguments.length) return callback;
  	callback = _;
  	return _main;
  };
  _main.dispatcher = function(_) {
  	if (!arguments.length) return dispatcher;
  	dispatcher = _;
  	return _main;
  };
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
	
	return _main;	
};spec.d1.crosshair = function(){
	var svg_elem, x, y, data, dispatcher;
	
	function _main(svg) {
		var getDataPoint = function (e) {
			var i;
      if(e.shiftKey){
        var s_window = [Math.floor(i_scale.invert(e.xcoor-10)),
          Math.floor(i_scale.invert(e.xcoor+10))];

        i = s_window[0] + whichMax( data.slice(s_window[0],s_window[1]+1));
      }else{
        i = Math.floor(i_scale.invert(e.xcoor));					
      }
			return i;
		};
		
		var i_scale = x.copy();
		var line_idx = d3.select(".main-focus").node().nSpecs;
		
		svg_elem = svg.append("g")
			.attr("class", "crosshair")
			.datum(null);

		svg_elem.append("circle")
			.attr("class", "clr"+ line_idx)
			.attr("r", 4.5)
			.on("click",function(){
				svg.toggleClass("selected");
			})
			.on("mouseenter",function(){svg.classed("highlighted",true)})
			.on("mouseleave",function(){svg.classed("highlighted",false)});

		svg_elem.append("text")
			.attr("x", 9)
			.attr("dy", "-1em");
			
		svg_elem
			.on("_regionchange", function(e){
				if(e.x){					
					svg_elem.datum(null);
					svg_elem.attr("transform", "translate(" + (-1000) + "," + (-1000) + ")");
				}else{
					var datum = svg_elem.datum();
					if(datum)
						svg_elem.attr("transform", "translate(" + x(datum.x) + "," + y(datum.y) + ")");					
				}
			})
			.on("_mousemove", function(e){
        var i = getDataPoint(e);
      
        if(typeof data[i] === 'undefined'){
					svg_elem.attr("i_pos", null);
					svg_elem.datum(null);
					return;
				}				
				svg_elem.attr("i_pos", i);			
				svg_elem.datum(data[i]);				
				svg_elem.attr("transform", "translate(" + x(data[i].x) + "," + y(data[i].y) + ")");
				svg_elem.select("text").text(d3.round(data[i].x,3));				
			});
		
				
		svg_elem.node().dataSlice = function (_) {
			if (!arguments.length) return i_scale.domain();
			i_scale.domain(_);
		};
	
		svg_elem.node().show = function (_) {
			if (!arguments.length) return !(svg_elem.style("display")==="none");			
			svg_elem.style("display", _? null : "none");
			dispatcher.on("mousemove.line."+dispatch_idx, 
				_? svg_elem.on("_mousemove") : null);	
		};
	
		svg_elem.node().enable = function (_) {
			if (!arguments.length) return params.crosshair;
			if (_){
				dispatcher.on("mouseenter.line."+dispatch_idx, function(){svg_elem.node().show(true)});
				dispatcher.on("mouseleave.line."+dispatch_idx, function(){svg_elem.node().show(false)});		
			}
			else{
				dispatcher.on("mouseenter.line."+dispatch_idx, null);
				dispatcher.on("mouseleave.line."+dispatch_idx, null);		
			}
			svg_elem.node().show(_);
		};
		svg_elem.node().i = function (_) {
			if (!arguments.length) return svg_elem.attr("i_pos");
			svg_elem.attr("i_pos", i);
			svg_elem.datum(data[i]);
		}
		
		// Register event listeners
		var dispatch_idx = ++d3.select(".main-focus").node().dispatch_idx;
		dispatcher.on("regionchange.line."+dispatch_idx, svg_elem.on("_regionchange"));
		dispatcher.on("mouseenter.line."+dispatch_idx, function(){svg_elem.node().show(true)});
		dispatcher.on("mouseleave.line."+dispatch_idx, function(){svg_elem.node().show(false)});
		dispatcher.on("mousemove.line."+dispatch_idx, svg_elem.on("_mousemove"));	
		dispatcher.on("crosshairEnable.line."+dispatch_idx, svg_elem.node().enable);

		
		return svg_elem;									
	}
	
  _main.dispatcher = function(_){
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return _main;
  };
	
  _main.datum = function(_){
    if (!arguments.length) return data;
    data = _;
    return _main;
  };
		
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
	
	return _main;
};
spec.d1.integrate = function(){
	var integ_container, x, y, dispatcher;
	
	function _main(svg) {			
		function integral_elem(integ_data, integ_value){
			var path_elem, text_elem;
			return function(svg){
				var svg_elem = svg.append("g");
				
				path_elem = svg.append("path")
					.attr("class", "line")
					.datum(integ_data);
				
				var text_g = svg.append("g")
					.attr("class", "integration-text");
					
				var text_rect = text_g.append("rect")
				
				text_elem = text_g.append("text")
					.datum(integ_value)
					.text((integ_value/integration_factor).toFixed(2))
					.on("focus", function(){})
					.on("blur", function(){})
				
				var bbox = text_elem.node().getBBox();
				text_elem.attr("dx", -bbox.width/2)
					.attr("dy", bbox.height/2);
				
				text_rect.attr("width", bbox.width +4)
					.attr("height", bbox.height +4)				
					.attr("x", bbox.x -2)
					.attr("y", bbox.y -2);
				
				text_g.on("mouseenter", function () {
					text_rect.classed("highlight", true);
					path_elem.classed("highlight", true);
				})
				.on("mouseleave", function () {
					text_rect.classed("highlight", false);
					path_elem.classed("highlight", false);
				})
				.on("contextmenu", d3.contextMenu(
				  [{
		 				title: 'Set integral',
		 				action: modals.input("Set Integral to: ",
							text_elem.text(),
		 					function (input) {
								integration_factor = text_elem.datum()/input;
								dispatcher.integ_refactor();
		 					}
		 				),
		 			}]
				));
			
				
				svg_elem.on("_redraw", function () {
					path_elem.attr("d", path);
					var mid_p = path_elem.node()
						.getPointAtLength(0.5 * path_elem.node().getTotalLength());
					
					text_g.attr("transform", "translate("+ mid_p.x +","+ mid_p.y +")");
					
					var bbox = text_elem.node().getBBox();
					text_rect.attr("width", bbox.width +2)
						.attr("height", bbox.height +2)				
						.attr("x", bbox.x -1)
						.attr("y", bbox.y -1);
				})
				.on("_refactor", function () {
					text_elem.text((integ_value/integration_factor).toFixed(2));
					var bbox = text_elem.node().getBBox();
					text_elem.attr("dx", -bbox.width/2);
					svg_elem.on("_redraw")();
				});
				
				// Register event listeners
				var dispatch_idx = ++d3.select(".main-focus").node().dispatch_idx;
				dispatcher.on("redraw.integ."+dispatch_idx, svg_elem.on("_redraw"));
				dispatcher.on("integ_refactor."+dispatch_idx, svg_elem.on("_refactor"));
			};
		}
		
		var width = svg.attr("width"),
				height = svg.attr("height");
		
		var reduction_factor = 20;
		var integration_factor;
		
		var path = d3.svg.line()
			.x(function(d) { return x(d.x); })
			.y(function(d) { return y(d.y/reduction_factor)-y.range()[0]/2; });
			
		
		integ_container = svg.append("g")
			.attr("class", "integration")
		
		integ_container.node().addIntegral = function (data) {
			var integ_data = getIntegral(data);
			var integ_value = integ_data[integ_data.length-1].y;
			
			if(!integration_factor)
				integration_factor = integ_value;
			
			integ_container.call(integral_elem(integ_data, integ_value));
		};
		
		return integ_container;						
	}
	
	function getIntegral(data){
		var _cumsum = cumsum(data.map(function(d) { return d.y; }));
		
		var ret = data.map(function(d,i){
			return {x:d.x, y:_cumsum[i]};
		});	
		return ret;
	}	
	
  _main.dispatcher = function(_){
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return _main;
  };
	
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
	
	return _main;
};
spec.d1.line = function () {
	var data, x, y, dispatcher, range={}, svg_elem, hasCrosshair = true;
	
	function _main(svg) {
		var _crosshair, dataResample, data_slice, segments = [], scale_factor = 1;
		
		var path = d3.svg.line()
			.x(function(d) { return x(d.x); })
			.y(function(d) { return y(d.y * scale_factor); });
		
		var width = svg.attr("width")
		
		svg_elem = svg.append("g")
			.attr("class", "spec-line")
			.attr("clip-path","url(#clip)")
		
		svg_elem.node().range = range;
			
		var line_idx = d3.select(".main-focus").node().nSpecs;
		var path_elem = svg_elem.append("path")
      .datum(data)
			.attr("class", "line clr"+ line_idx)
		
		if(hasCrosshair)
			_crosshair = (spec.d1.crosshair() 
				.datum(data)
				.xScale(x)
				.yScale(y)
				.dispatcher(dispatcher)
			)(svg_elem);
		
		var _integrate = (spec.d1.integrate() 
			.xScale(x)
			.yScale(y)
			.dispatcher(dispatcher)
			)(svg_elem);
		
		svg_elem
			.on("_redraw", function(e){				
				path_elem.attr("d", path);
				svg_elem.selectAll(".segment").attr("d", path);
			})
			.on("_regionchange", function(e){
				if(e.xdomain){
					data_slice = sliceDataIdx(data, x.domain(), range.x);
					dataResample = resample(data.slice(data_slice.start, data_slice.end), x.domain(), width);	
					path_elem.datum(dataResample);
					range.y = d3.extent(dataResample.map(function(d) { return d.y; }));
					range.y[0] *= scale_factor;
					range.y[1] *= scale_factor;
					//scale=1
					
					svg_elem.selectAll(".segment").remove();
					segments.forEach(function (e) {
						var seg_data = dataResample.filter(function (d) {
							return d.x < e[0] &&  d.x > e[1];
						})
						svg_elem.append("path")
				      .datum(seg_data)
							.attr("class", "segment");				
					});
					
					if(hasCrosshair)
						_crosshair.node().dataSlice([data_slice.start, data_slice.end]);
				}
			})
			.on("_integrate", function(e){
				var sliced_data = getSlicedData(data, e.xdomain, range.x);

				_integrate.node().addIntegral (sliced_data);
				svg_elem.node().addSegment([sliced_data[0].x, sliced_data[sliced_data.length-1].x]);
				dispatcher.redraw({y:true});
			})
			.on("_segment", function (e) {
			});
		
		// Register event listeners
		var dispatch_idx = ++d3.select(".main-focus").node().dispatch_idx;
		dispatcher.on("regionchange.line."+dispatch_idx, svg_elem.on("_regionchange"));
		dispatcher.on("redraw.line."+dispatch_idx, svg_elem.on("_redraw"));
		dispatcher.on("integrate.line."+dispatch_idx, svg_elem.on("_integrate"));
		
		svg_elem.node().specData = function () { return data;	};
		svg_elem.node().dataSlice = function () { return data_slice;	};
		svg_elem.node().specRange = function () { return range;	};
		svg_elem.node().setScaleFactor = function (_) {
			if (!arguments.length) return scale_factor;
			scale_factor = _;
			svg_elem.on("_redraw")({y:true});
		};
		svg_elem.node().addSegment = function (seg) {
			if(seg[0].constructor === Array){
				for (var i = seg.length - 1; i >= 0; i--)
					this.addSegment(seg[i]);				
			}else{
				segments.push(seg);
				var seg_data = dataResample.filter(function (d) {
					return d.x <= seg[0] &&  d.x >= seg[1];
				});
			
				svg_elem.append("path")
		      .datum(seg_data)
					.attr("class", "segment")
					.attr("d", path);
			}
		};
		svg_elem.node().addSegmentByIndex = function (seg) {
			if(seg[0].constructor === Array){
				for (var i = seg.length - 1; i >= 0; i--)
					this.addSegmentByIndex(seg[i]);				
			}else{
				this.addSegment([data[seg[0]].x, data[seg[1]].x]);
			}
		};
		
		return svg_elem;									
	}
	
  _main.datum = function(_){
    if (!arguments.length) return data;
		if(!_[0].x){ //if data is array, not xy format
			var xscale = d3.scale.linear()
				.range(d3.select(".main-focus").node().range.x)
				.domain([0, _.length]);
			
			data = _.map(function(d,i){ return {x:xscale(i), y:d}; });
		}else{
    data = _;
		}
		
		range.x = [data[0].x, data[data.length-1].x];
		range.y = d3.extent(data.map(function(d) { return d.y; }));
		
		console.log(data, range)
    return _main;
  };
	
  _main.dispatcher = function(_){
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return _main;
  };
  _main.crosshair = function(_){
    if (!arguments.length) return hasCrosshair;
    hasCrosshair = _;
    return _main;
  };
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
	
	return _main;
};
spec.d1.mainBrush = function(){
	var svg_elem, x, y, dispatcher;
	
	function _main(svg) {
		function makeBrushEvent() {
			if (_brush.empty()){
				_brush.extent([0,0]);
				svg_elem.call(_brush);
				return null;
    	}
	
			var e = {xdomain:_brush.extent().reverse()}
			_brush.clear();				
			svg_elem.call(_brush);
			return e;
		};
		function changeRegion () {			
			var e = makeBrushEvent();
			if(e)
				svg.on("_regionchange")(e);
    };		
		function peakdel () {
			var e = makeBrushEvent();
			if(e)
				dispatcher.peakdel(e);
    };
		function integrate () {
			var e = makeBrushEvent();
			if(e)
				dispatcher.integrate(e);
    };
		function peakpick() {
			_brush.clear()
			svg_elem.call(_brush);
		};

		var width = svg.attr("width"),
				height = svg.attr("height");
		
	  var _brush = d3.svg.brush()
			.x(x)
	    .on("brushend", changeRegion);
		
		svg_elem = svg.append("g")
			.attr("class", "main-brush")
			.call(_brush);
				
		svg_elem.selectAll("rect")
			.attr("height", height);
		
		svg_elem.select(".background")
			.style('cursor', null)
			.style('pointer-events', 'all');
		
		d3.select(".main-focus").style("cursor", "crosshair");
		
		svg_elem.node().peakpickEnable = function (_) {
			svg_elem.classed("peakpick-brush", _);
			d3.select(".main-focus")
				.style("cursor", _? 'url('+cursor.peakpick+'), auto' : "crosshair");
			
			_brush.on("brushend", _? peakpick : changeRegion);
		};
		svg_elem.node().peakdelEnable = function (_) {
			svg_elem.classed("peakdel-brush", _);
			d3.select(".main-focus")
					.style("cursor", _? 'url('+cursor.peakdel+'), auto' : "crosshair");
			
			_brush.on("brushend", _? peakdel : changeRegion);
		};
		svg_elem.node().integrateEnable = function (_) {
			svg_elem.classed("integrate-brush", _);
			d3.select(".main-focus")
					.style("cursor", _? 'url('+cursor.addinteg+'), auto' : "crosshair");
			
			_brush.on("brushend", _? integrate : changeRegion);
		};
	
		// Register event listeners
		var dispatch_idx = ++d3.select(".main-focus").node().dispatch_idx;		
		dispatcher.on("peakpickEnable.brush."+dispatch_idx, svg_elem.node().peakpickEnable);
		dispatcher.on("peakdelEnable.brush."+dispatch_idx, svg_elem.node().peakdelEnable);
		dispatcher.on("integrateEnable.brush."+dispatch_idx, svg_elem.node().integrateEnable);
		
		return svg_elem;									
	}

  _main.dispatcher = function(_){
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return _main;
  }
	
  _main.xScale = function(_){
    if (!arguments.length) return x;
    x = _;
    return _main;
  }

  _main.yScale = function(_){
    if (!arguments.length) return y;
    y = _;
    return _main;
  }
	
	return _main;
};
spec.d1.scaleBrush = function(){
	var svg_elem, axisorient, x, y, dispatcher,brushscale;
	
	function _main(svg) {
		var mainscale = x? x : y;
		brushscale = x? x.copy() : y.copy();
		axisorient = x? "bottom": "top";
		
    var axis = d3.svg.axis().scale(brushscale).orient(axisorient)
			.tickFormat(d3.format("s"));;
    
    var _brush = d3.svg.brush()
      .x(brushscale)
			.on("brushstart",function(){d3.event.sourceEvent.stopPropagation();})
			.on("brushend", function () {//test x or y domain?
				var extent = _brush.empty()? brushscale.domain() : _brush.extent().reverse();
				extent = extent.sort(brushscale.domain()[0] > brushscale.domain()[1]?
					d3.descending : d3.ascending );
				
				d3.select(".main-focus").on("_regionchange")( x ? {xdomain:extent}	: {ydomain:extent} );
			})
		
		svg_elem = svg.append("g")
			.attr("class", (x? "x":"y") + " scale-brush")
			.attr("transform", x? "translate(0," + -20 + ")"
				: "translate(-20," + 0 + ")rotate("+90+")"
			);

    svg_elem.append("g")
	    .call(axis)
			.attr("class", "brush-axis")
    
        
		svg_elem.append("g")
      .attr("class", "brush")
      .call(_brush)
      .selectAll("rect")
        .attr("y", -5)
        .attr("height", 10);
		
						
		svg_elem.select(".background")
			.style('pointer-events', 'all');
	
		
		svg_elem
			.on("_rangechange", function(e){
				if(e.x || (e.y && y)){
					brushscale.domain( x? e.x : e.y);					
					
					svg_elem.select(".brush-axis").call(axis);
					svg_elem.select(".brush").call(_brush);					
				}
			})
			.on("_regionchange", function(e){
				if(e.xdomain || (e.ydomain && y)){
					var domain = process_domains(mainscale.domain(), brushscale.domain())
					_brush.extent(domain);
				}
			})
			.on("_redraw", function(e){
				if(e.x || (e.y && y))
					svg_elem.select(".brush").call(_brush);				
			});
		
		// Register event listeners
		var dispatch_idx = ++d3.select(".main-focus").node().dispatch_idx;
		dispatcher.on("rangechange.scalebrush."+dispatch_idx, svg_elem.on("_rangechange"));
		dispatcher.on("regionchange.scalebrush."+dispatch_idx, svg_elem.on("_regionchange"));
		dispatcher.on("redraw.scalebrush."+dispatch_idx, svg_elem.on("_redraw"));		

		
		
		return svg_elem;									
	}
	
	function process_domains(main, brush) {
		var domain = [0,0];
		if(main[0]>main[1]){
			domain[0] = Math.min(main[0], brush[0]);
			domain[1] = Math.max(main[1], brush[1]);
		}else{
			domain[0] = Math.max(main[0], brush[0]);
			domain[1] = Math.min(main[1], brush[1]);
		}
		
		if(domain.join()==brush.join())
			domain = [0,0];
		
		return domain;
	}
	
  _main.dispatcher = function(_){
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return _main;
  }
	
  _main.xScale = function(_){
    if (!arguments.length) return x;
    x = _;
    return _main;
  }

  _main.yScale = function(_){
    if (!arguments.length) return y;
    y = _;
    return _main;
  }
	
	return _main;
};
spec.d1.pp = function(){
	var svg_elem, x, y, dispatcher;
	
	function _main(svg) {
		var menu = [
			{
				title: '\uf1f8 Delete peak',
				action: function(elm, d, i) {
					dispatcher.peakdel({xdomain:[d[0], d[0]]});
				}
			}
		];
		
		var width = svg.attr("width"),
				height = svg.attr("height");
		
		var _peaks = [], _peaks_vis = [];
		
		svg_elem = svg.append("g")
			.attr("class", "peaks")
		
		svg_elem
			.on("_click", function(e){
				if(!events.crosshair)
					d3.selectAll(".crosshair").each(function(){
						d3.select(this).on("_mousemove")(e);
					});
				
				var clicked_peaks = d3.selectAll(".crosshair").data()
					.sort(function(a,b){return d3.descending(a.y, b.y)});
				
				dispatcher.peakpick(clicked_peaks[0]);				
			})
			.on("_regionchange", function (e) {
				if(e.xdomain){
					var domain = (x.domain()).sort(d3.descending)
					_peaks_vis = _peaks.filter(function(el){
						return el[0] < domain[0] && el[0] > domain[1];
					});
				}
			})
			.on("_redraw", function(e){ // TODO: redraw on x only!!				
				var peak_text = svg_elem.selectAll("text")
					.data(_peaks_vis)
				
				peak_text.enter()
					.append("text")
						.text(function(d){return d3.round(d[0] ,3);})
						.attr("dy", "0.35em")
						.attr("focusable", true)
						.on("focus", function(){})
						.on("keydown", function(d) {
							if(d3.event.keyCode===68){
								dispatcher.peakdel({xdomain:[d[0], d[0]]});
							}
						})
						.on("contextmenu", d3.contextMenu(menu));
						
				
				
				peak_text.exit().remove();
				
				var peak_line = svg_elem.selectAll(".peak-line")
					.data(_peaks_vis)
				
				peak_line.enter()
					.append("path")
					.attr("class", "peak-line")
					.style("stroke", "black")
					.style("fill", "none");	
				
				peak_line.exit().remove();
				
				if(_peaks_vis.length === 0)
					return;
				
				// visualize the rest of the peaks
				var current_x;
				var labels_x = [];
				var text_width = svg_elem.select("text")
					.node().getBBox().height; //prevent overlap of peak labels.
		
				svg_elem.selectAll("text")
					.sort( function(a,b){return d3.ascending(a[0], b[0]);} )
					.text(function(d){return d3.round(d[0] ,3);})
					.attr("transform",function(d,i){
						
						var this_x = x(d[0]);
						if(this_x > current_x - text_width) //prevent overlap of peak labels.
							this_x = current_x - text_width
				
						current_x = this_x;
						labels_x.push(this_x);
						return "translate(" + this_x + ",0)rotate(90)"; 
				 	})
					.append("title")
						.text("dbl Click to edit");
	
				svg_elem.selectAll("path")
					.sort( function(a,b){return d3.ascending(a[0], b[0]);} )
					.attr("d", function(d,i){return peakLine(d[0],d[1],labels_x[i])});
			})
			.on("_peakpick", function (e) {
				_peaks.push([e.x, e.y]);
				_peaks_vis.push([e.x, e.y]);				
				
				svg_elem.on("_redraw")({x:true, y:true});
			})
			.on("_peakdel", function (e) {
				if(e.xdomain){
					var domain = (e.xdomain).sort(d3.descending)
					_peaks = _peaks.filter(function(el){
						return !(el[0] <= domain[0] && el[0] >= domain[1]);
					});
				}
				if(e.ydomain){
					var domain = (e.ydomain).sort(d3.descending)
					_peaks = _peaks.filter(function(el){
						return !(el[0] <= domain[0] && el[0] >= domain[1]);
					});
				}			
				svg_elem.on("_regionchange")({xdomain:x.domain(), ydomain:y.domain()});
				svg_elem.on("_redraw")({x:true, y:true});
			});
		
		// Register event listeners
		var dispatch_idx = ++d3.select(".main-focus").node().dispatch_idx;
		dispatcher.on("regionchange.peaks."+dispatch_idx, svg_elem.on("_regionchange"));
		dispatcher.on("redraw.peaks."+dispatch_idx, svg_elem.on("_redraw"));		
		dispatcher.on("peakpickEnable.peaks."+dispatch_idx, function (_) {
				dispatcher.on("click.peaks."+dispatch_idx, 
					_? svg_elem.on("_click"): null);
		});
		
		dispatcher.on("peakpick.peaks."+dispatch_idx, svg_elem.on("_peakpick"));
		dispatcher.on("peakdel.peaks."+dispatch_idx, svg_elem.on("_peakdel"));
		
		svg_elem.node().peaks = function(){return _peaks;};
		svg_elem.node().addpeaks = function(_){
			if(!_.x){
				for (var i = _.length - 1; i >= 0; i--) {
					this.addpeaks( _[i] );
				}
			}else{
				if(_peaks.indexOf([_.x, _.y]) == -1) //TODO:check if peak already exists.
					_peaks.push([_.x,_.y]);
			}
		};
		return svg_elem;						
	}
	
	function peakLine(line_x, line_y, label_x){
		return d3.svg.line()([[label_x, 40], 
													[x(line_x), 60],
													[x(line_x), Math.max(y(line_y)-5, 60) ]]);
	}	
	
  _main.dispatcher = function(_){
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return _main;
  }
	
  _main.xScale = function(_){
    if (!arguments.length) return x;
    x = _;
    return _main;
  }

  _main.yScale = function(_){
    if (!arguments.length) return y;
    y = _;
    return _main;
  }
	
	return _main;
};
spec.d1.main_focus = function () {
	var focus, width, height, x, y, dispatcher, data, range = {};

	var zoomer = d3.behavior.zoom()
		.on("zoom", function () {
			/* * When a y brush is applied, the scaled region should go both up and down.*/
			var new_range = range.y[1]/zoomer.scale() - range.y[0];
			var addition = (new_range - (y.domain()[1] - y.domain()[0]))/2
		
			var new_region = [];
			if(y.domain()[0] == range.y[0]) new_region[0] = range.y[0];
			else{new_region[0] = Math.max(y.domain()[0]-addition, range.y[0]);}
			new_region[1] = new_region[0] + new_range;
		
			focus.on("_regionchange")(
				{zoom:true,	ydomain:new_region}
			);
		});
	
	function _main(all_panels) {
		focus = all_panels.append("g")
		    .attr("class", "main-focus")
		    .attr("pointer-events", "all")
				.attr("width", width)
				.attr("height", height)
				.call(zoomer)
				.on("dblclick.zoom", null)
				.on("mousedown.zoom", null);
		
		
		/****** Attach functions on svg node ********/
		focus.node().dispatch_idx =  0; // an index as a namespace for dispacther evernts.
		focus.node().nSpecs = 0;				// count how many spec-lines are displayed (used for coloring.)
		focus.node().xScale = x;
		focus.node().yScale = y;
		focus.node().range = range;
		focus.node().addPeaks = function (idx) { //TODO:move peaks to line
			focus.select(".peaks").node().addpeaks(data.subset(idx));			
			focus.select(".peaks").on("_regionchange")({xdomain:true});
			focus.select(".peaks").on("_redraw")({x:true});			
		};
		focus.node().addSpecLine = function(spec_data, crosshair){
			if(arguments.length < 2)
				crosshair = true;
			
			focus.call(
				spec.d1.line()
					.datum(spec_data)
					.xScale(x)
					.yScale(y)
					.crosshair(crosshair)
					.dispatcher(dispatcher)
			);
			var x0 = d3.max(focus.selectAll(".spec-line")[0].map(function(s){return s.range.x[0]})),
					x1 = d3.min(focus.selectAll(".spec-line")[0].map(function(s){return s.range.x[1]})),
					y0 = d3.min(focus.selectAll(".spec-line")[0].map(function(s){return s.range.y[0]})),
					y1 = d3.max(focus.selectAll(".spec-line")[0].map(function(s){return s.range.y[1]}));
			
			focus.on("_rangechange")({x:[x0,x1], y:[y0,y1]});
			focus.node().nSpecs++;
			
		}
		focus.node().getThreshold = function (callback) {
			focus.call(
				spec.d1.threshold()
					.xScale(x).yScale(y)
					.dispatcher(dispatcher)
					.callback(callback)
			);	
		};
		//focus.node().getThreshold(null);
		
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
					if(!e.zoom) //If y domain is changed by brush, adjust zoom scale
						zoomer.scale((range.y[0]-range.y[1])/(y.domain()[0]-y.domain()[1]));
				}else{
					//modify range.y  and reset the zoom scale
					var y0 = d3.min(focus.selectAll(".spec-line")[0].map(function(s){return s.range.y[0]})),
					y1 = d3.max(focus.selectAll(".spec-line")[0].map(function(s){return s.range.y[1]}));
					range.y = [y0,y1];
					y.domain(range.y);
					dispatcher.rangechange({y:range.y});
					zoomer.scale(1);
				}
			
				dispatcher.regionchange({ydomain:y.domain()});
				focus.on("_redraw")({x:e.xdomain, y:true});
			})
			.on("_rangechange", function(e){
				if(e.x)
					range.x = e.x;
				if(e.y)
					range.y = e.y;
			
				dispatcher.rangechange(e);
				focus.on("_regionchange")({xdomain:range.x, ydomain:range.y});
			})
			.on("mouseenter", dispatcher.mouseenter)
			.on("mouseleave", dispatcher.mouseleave)
			.on("mousemove", function(e){
				var new_e = d3.event;
				new_e.xcoor = d3.mouse(this)[0];
				new_e.ycoor = d3.mouse(this)[1];
			
				dispatcher.mousemove(new_e);
			})
			.on("mousedown", function (e) {	// Why?! because no brush when cursor on path?
			  var new_click_event = new Event('mousedown');
			  new_click_event.pageX = d3.event.pageX;
			  new_click_event.clientX = d3.event.clientX;
			  new_click_event.pageY = d3.event.pageY;
			  new_click_event.clientY = d3.event.clientY;
			  focus.select(".main-brush").node()
					.dispatchEvent(new_click_event);
			})
			.on("click", function(e){
				var new_e = d3.event;
				new_e.xcoor = d3.mouse(this)[0];
				new_e.ycoor = d3.mouse(this)[1];
		
				dispatcher.click(new_e)
			})
			.on("dblclick", dispatcher.regionfull);

		dispatcher.on("regionfull",function () {
			focus.on("_regionchange")({xdomain:range.x});		
		});
			
		// overlay rectangle for mouse events to be dispatched.
		focus.append("rect")
			.attr("width", width)
			.attr("height", height)
			.style("fill", "none");

		//brushes
		focus.call(
			spec.d1.mainBrush()
				.xScale(x)
				.dispatcher(dispatcher)
		);

		//spectral lines
		focus.node().addSpecLine(data);

		//peak picker	
		focus.call(
			spec.d1.pp()
				.xScale(x)
				.yScale(y)
				.dispatcher(dispatcher)
		);
	}
	
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
	return _main;	
};spec.d1.main = function(){
  var data, svg_width, svg_height;

  function d1main(svg){
    /* * Check variable definitions**/
    if (typeof data === 'undefined'){
        data = svg.datum();
        if (typeof data === 'undefined')
            throw new Error("nmr1d: no data provided.");
      
        svg.datum(null);    
    }
    if (typeof svg_width === 'undefined' || typeof svg_height === 'undefined'){
        svg_width = +svg.attr("width");    svg_height = +svg.attr("height");
				
        if (typeof svg_width === 'undefined' || typeof svg_height === 'undefined'
					|| isNaN(svg_width) || isNaN(svg_height))
            throw new Error("nmr1d: chart width or height not defined.");
    }
    if (svg_width < 100 || svg_height < 100){
        throw new Error("nmr1d: Canvas size too small. Width and height must be at least 100px");
    }
		
		var brush_margin = 20;

    var margin = {
        top: 10 + brush_margin,
        right: 40,
        bottom: 30,
        left:10 + brush_margin
    };
  
  
  
		var width = svg_width - margin.left - margin.right,
        height = svg_height - margin.top - margin.bottom;
	  
		applyCSS2();
		
    var x = d3.scale.linear().range([0, width]),
    y = d3.scale.linear().range([height, 0]);
  
    var xAxis = d3.svg.axis().scale(x).orient("bottom"),
        yAxis = d3.svg.axis().scale(y).orient("right")
          .tickFormat(d3.format("s"));
  
    svg.append("defs").append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("width", width)
        .attr("height", height);
  
		var all_panels = svg.append("g")
			.attr("class", "all-panels")
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		svg.call(spec.menu());
		
		/**** Keyboard events and logger ****/
		registerKeyboard();
		var div = all_panels.append("svg:foreignObject")
				.attr("class", "logger")
				.attr("pointer-events", "all")
			.append("xhtml:div")
				.style({
					"left":margin.left+"px",
					"top":margin.top+"px"
				});

		div.append("a").attr("class", "progress");

		dispatcher.on("log",function log(message) {
		    div.append("a")
		      .text(message)
		    .transition()
		      .duration(2500)
		      .style("opacity", 1e-6)
					.remove();
		});
		
		//axes	and their labels
		all_panels.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")");

		all_panels.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + width + ",0)");;
		
		all_panels.append("text")
	    .attr("class", "x label")
	    .attr("text-anchor", "middle")
	    .attr("x", width/2)
	    .attr("y", height)
			.attr("dy", "2.8em")
	    .text("Chemical shift (ppm)");
		
		all_panels.append("text")
	    .attr("class", "y label")
	    .attr("text-anchor", "end")
	    .attr("y", width)
	    .attr("dy", "-.75em")
	    .attr("transform", "rotate(-90)")
	    .text("Intensity");
		
		dispatcher.on("redraw.all_panels", function (e) {
			if(e.x)
				all_panels.select(".x.axis").call(xAxis);
			if(e.y)
				all_panels.select(".y.axis").call(yAxis);
		});
		
		
		//Main focus
		all_panels.call(spec.d1.main_focus()
			.datum(data)
			.xScale(x)
			.yScale(y)
			.width(width)
			.height(height)
			.dispatcher(dispatcher));
		
		//Scale brushes
		all_panels.call(
			spec.d1.scaleBrush()
				.xScale(x)
				.dispatcher(dispatcher)
		);
	
		all_panels.call(
			spec.d1.scaleBrush()
				.yScale(y)
				.dispatcher(dispatcher)
		);
	
		//console.log(getComputedStyle(d3.select(".spec-line").select(".line").node()));
		
		
		
		/* testing peak picker */
		/*dispatcher.peakpick(data[1000]);
		dispatcher.peakpick(data[1110]);
		dispatcher.peakpick(data[1100]);
		dispatcher.peakpick(data[1100]);
		dispatcher.peakdel({xdomain:[250, 195]});
		dispatcher.integrate({xdomain:[265, 260]});
		
		focus.select(".peaks").node().addpeaks(data[1200]);
		dispatcher.peakpick(data[1000]);*/
		
		
  }
 
  d1main.datum = function(x){
    if (!arguments.length) return data;
    data = x;
    return d1main;
  };

  d1main.width = function(x){
    if (!arguments.length) return svg_width;
    svg_width = x;
    return d1main;
  };

  d1main.height = function(x){
    if (!arguments.length) return svg_height;
    svg_height = x;
    return d1main;
  };
  return d1main;

};
  window.spec = spec;
	console.log("specdraw:"+ spec.version);
})();
/*
 (c) 2013, Vladimir Agafonkin
 Simplify.js, a high-performance JS polyline simplification library
 mourner.github.io/simplify-js
*/

(function () { 'use strict';

// to suit your point format, run search/replace for '.x' and '.y';
// for 3D version, see 3d branch (configurability would draw significant performance overhead)

// square distance between 2 points
function getSqDist(p1, p2) {

    var dx = p1.x - p2.x,
        dy = p1.y - p2.y;

    return dx * dx + dy * dy;
}

// square distance from a point to a segment
function getSqSegDist(p, p1, p2) {

    var x = p1.x,
        y = p1.y,
        dx = p2.x - x,
        dy = p2.y - y;

    if (dx !== 0 || dy !== 0) {

        var t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);

        if (t > 1) {
            x = p2.x;
            y = p2.y;

        } else if (t > 0) {
            x += dx * t;
            y += dy * t;
        }
    }

    dx = p.x - x;
    dy = p.y - y;

    return dx * dx + dy * dy;
}
// rest of the code doesn't care about point format

// basic distance-based simplification
function simplifyRadialDist(points, sqTolerance) {

    var prevPoint = points[0],
        newPoints = [prevPoint],
        point;

    for (var i = 1, len = points.length; i < len; i++) {
        point = points[i];

        if (getSqDist(point, prevPoint) > sqTolerance) {
            newPoints.push(point);
            prevPoint = point;
        }
    }

    if (prevPoint !== point) newPoints.push(point);

    return newPoints;
}

// simplification using optimized Douglas-Peucker algorithm with recursion elimination
function simplifyDouglasPeucker(points, sqTolerance) {

    var len = points.length,
        MarkerArray = typeof Uint8Array !== 'undefined' ? Uint8Array : Array,
        markers = new MarkerArray(len),
        first = 0,
        last = len - 1,
        stack = [],
        newPoints = [],
        i, maxSqDist, sqDist, index;

    markers[first] = markers[last] = 1;

    while (last) {

        maxSqDist = 0;

        for (i = first + 1; i < last; i++) {
            sqDist = getSqSegDist(points[i], points[first], points[last]);

            if (sqDist > maxSqDist) {
                index = i;
                maxSqDist = sqDist;
            }
        }

        if (maxSqDist > sqTolerance) {
            markers[index] = 1;
            stack.push(first, index, index, last);
        }

        last = stack.pop();
        first = stack.pop();
    }

    for (i = 0; i < len; i++) {
        if (markers[i]) newPoints.push(points[i]);
    }

    return newPoints;
}

// both algorithms combined for awesome performance
function simplify(points, tolerance, highestQuality) {

    if (points.length <= 1) return points;

    var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

    points = highestQuality ? points : simplifyRadialDist(points, sqTolerance);
    points = simplifyDouglasPeucker(points, sqTolerance);

    return points;
}

// export as AMD module / Node module / browser or worker variable
if (typeof define === 'function' && define.amd) define(function() { return simplify; });
else if (typeof module !== 'undefined') module.exports = simplify;
else if (typeof self !== 'undefined') self.simplify = simplify;
else window.simplify = simplify;

})();

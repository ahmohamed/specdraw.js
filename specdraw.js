(function () { "use strict";
  var spec = {version: "0.5.0"}; // semver
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
var events = {
	crosshair:true,
	peakpick:false,
	peakdel:false,
	integrate:false,	
}

events.crosshairToggle = function () {
	events.crosshair = !events.crosshair;
	dispatcher.crosshairEnable(events.crosshair);
}

events.peakpickToggle = function () {
	if(events.peakdel === true)
		events.peakdelToggle();
	if(events.integrate === true)
		events.integrateToggle();
	
	events.peakpick = !events.peakpick;
	dispatcher.peakpickEnable(events.peakpick);
}

events.peakdelToggle = function () {
	if(events.peakpick === true)
		events.peakpickToggle();
	if(events.integrate === true)
		events.integrateToggle();	
	
	events.peakdel = !events.peakdel;
	dispatcher.peakdelEnable(events.peakdel);
	console.log(events.peakdel)
	
}

events.integrateToggle = function () {
	if(events.peakpick === true)
		events.peakpickToggle();
	if(events.peakdel === true)
		events.peakdelToggle();

	events.integrate = !events.integrate;
	dispatcher.integrateEnable(events.integrate);	
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
	"rangechange", "regionchange","redraw",  	//redrawing events
	"mouseenter", "mouseleave", "mousemove", 	//mouse events
	"keyboard",																//Keyboard
	"peakpickEnable", "peakdelEnable", "peakpick", "peakdel",		//Peak picking events
	"integrateEnable", "integrate",						//Integration events
	"crosshairEnable",
	"blindregion"
);

var registerKeyboard = function(svg){
	svg.on("keydown", function() {
      svg.append("text")
          .attr("x","5")
          .attr("y","150")
          .style("font-size","50px")
          .text("keyCode: " + d3.event.keyCode)  
        .transition().duration(2000)
          .style("font-size","5px")
          .style("fill-opacity",".1")
	        .remove();
			
			if (d3.event.keyCode===80) { // p
				events.peakpickToggle();
			}else if (d3.event.keyCode===68) { // d
				events.peakdelToggle();
			}else if (d3.event.keyCode===73) { // i
				events.integrateToggle();
			}else if (d3.event.keyCode===67) { // c
				events.crosshairToggle();
			}
			
			dispatcher.keyboard(d3.event);
	  })
	  .on("focus", function(){});
}
spec.menu = function(){
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
	        menu_on = true;
	      });    
		  }else{
		    button.text("☰").on("click",null);    
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
			.style({
        "width": width+"px",
				"height": height*2+"px",
				"vertical-align": "middle",
				"line-height": height+"px",
				"overflow": "hidden",
				"color": "white"
			});
			
			

		var button = div_menu.append("xhtml:a")
			.style({
				"width": height+"px",
        "text-align": "center",
				"background": "#3B3B3B",
				"float": "left",
				"color": "white",
        "text-decoration":"none"
			})			
			.attr("class", "open-menu")
		  .attr("href", "#")
			.text("☰")
			.on("click", toggle);
 

		var links =  ["This", "little", "piggy", "went", "to", "market"];

		var nav = div_menu.append("xhtml:nav")
			.attr("class", "main-nav")
			.style({
        "background": "#3B3B3B",
        "overflow-y": "hidden"
			})
    	.call(css_trans("translateX("+ (-width) + "px)"));


		nav.selectAll("a")
			.data(links)
			.enter()
			.append("a")
		  	.text(function(d){return d;})
					
		nav.append("a")
	  	.text("Crosshair")
			.on("click", events.crosshairToggle);
		
		nav.append("a")
	  	.text("Peakpick")
			.on("click", events.peakpickToggle);

		nav.append("a")
	  	.text("Peakdel")
			.on("click", events.peakdelToggle);
		
		nav.append("a")
	  	.text("integrate")
			.on("click", events.integrateToggle);
			
		nav.selectAll("a")
			.attr("href","#")
	    .style({"color": "white",
	      "padding":"0 10px",
	      "display": "inline-block"
	    })
	  	.on("mouseenter",function(){
	  		d3.select(this).style("color", "red")
	    	d3.select(this).style("background", "black")
			})
	 		.on("mouseleave",function(){
	  		d3.select(this).style("color", "white")
	      d3.select(this).style("background", "none")
			});
		
		return svg_elem;									
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
}
spec.d1 = {};
spec.d1.crosshair = function(){
	var svg_elem, x, y, data, dispatcher;
	
	function _main(svg) {
		var i_scale = x.copy();
		
		svg_elem = svg.append("g")
			.attr("class", "crosshair")
			.style("display", "none")
			.datum(null);

		svg_elem.append("circle")
			.attr("r", 4.5)
			.on("click",function(){alert("any")});

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
        var i;
      
        if(e.shiftKey){
          var s_window = [Math.floor(i_scale.invert(e.xcoor-10)),
            Math.floor(i_scale.invert(e.xcoor+10))];

          i = s_window[0] + whichMax( data.slice(s_window[0],s_window[1]+1));
        }else{
          i = Math.floor(i_scale.invert(e.xcoor));					
        }
      
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
		
		// Register event listeners
		var dispatch_idx = +d3.select(".all-panels").attr("dispatch-index");
		dispatcher.on("regionchange.line."+dispatch_idx, svg_elem.on("_regionchange"));
		dispatcher.on("mouseenter.line."+dispatch_idx, function(){svg_elem.node().show(true)});
		dispatcher.on("mouseleave.line."+dispatch_idx, function(){svg_elem.node().show(false)});
		dispatcher.on("mousemove.line."+dispatch_idx, svg_elem.on("_mousemove"));	
		dispatcher.on("crosshairEnable.line."+dispatch_idx, svg_elem.node().enable);
		d3.select(".all-panels").attr("dispatch-index", dispatch_idx +1);	
		
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
	var svg_elem, x, y, dispatcher;
	
	function _main(svg) {
		
		var width = svg.attr("width"),
				height = svg.attr("height");
				
		
		console.log("integ", y.range())
		var path = d3.svg.line()
			.x(function(d) { return x(d.x); })
			.y(function(d) { return y(d.y)-y.range()[0]/2; });
			
		
		svg_elem = svg.append("g")
			.attr("class", "integration")
		
		svg_elem
			.on("_regionchange", function (e) {
			})
			.on("_redraw", function(e){				
				svg_elem.selectAll("path").attr("d", path);
			})
		
		svg_elem.node().addIntegral = function (data) {			
			svg_elem.append("path")
				.attr("class", "line")
				.datum(getIntegral(data))
				.attr("d", path);
		}
		
		// Register event listeners
		var dispatch_idx = +d3.select(".all-panels").attr("dispatch-index");
		dispatcher.on("redraw.integ."+dispatch_idx, svg_elem.on("_redraw"));
		d3.select(".all-panels").attr("dispatch-index", dispatch_idx + 1);
		
		return svg_elem;						
	}
	
	function getIntegral(data){
		var _cumsum = cumsum(data.map(function(d) { return d.y; }));
		
		var ret = data.map(function(d,i){
			return {x:d.x, y:_cumsum[i]/100};
		});	
		return ret;
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
}
spec.d1.line = function () {
	var data, dataResample, dispatcher, data_slice, path, x, y, range={}, width, height, svg_elem;
	
	function _main(svg) {
		path = d3.svg.line()
			.x(function(d) { return x(d.x); })
			.y(function(d) { return y(d.y); });
		
		width = svg.attr("width")
		
		svg_elem = svg.append("g")
			.attr("class", "spec-line")
			.attr("clip-path","url(#clip)")
			.datum(range);
		
		var path_elem = svg_elem.append("path")
      .datum(data)
			.attr("class", "line")
			/*.on("blur", function(){
				path_elem.style("stroke", "steelblue")
			})
			.attr("focusable", true)
			.on("focus", function(){path_elem.style("stroke", "green")});*/
		
		var _crosshair = (spec.d1.crosshair() 
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
			})
			.on("_regionchange", function(e){
				if(e.xdomain){
					data_slice = sliceData(data, x.domain(), range.x);
					dataResample = resample(data.slice(data_slice.start, data_slice.end), x.domain(), width);		
					
					path_elem.datum(dataResample);
					range.y = d3.extent(dataResample.map(function(d) { return d.y; }));
					//scale=1
					
					_crosshair.node().dataSlice([data_slice.start, data_slice.end]);
				}
			})
			.on("_integrate", function(e){
				var integ_slice = sliceData(data, e.xdomain, range.x)
				_integrate.node().addIntegral (data.slice(integ_slice.start, integ_slice.end));
			});
		
		// Register event listeners
		var dispatch_idx = +d3.select(".all-panels").attr("dispatch-index");
		dispatcher.on("regionchange.line."+dispatch_idx, svg_elem.on("_regionchange"));
		dispatcher.on("redraw.line."+dispatch_idx, svg_elem.on("_redraw"));
		dispatcher.on("integrate.line."+dispatch_idx, svg_elem.on("_integrate"));
		d3.select(".all-panels").attr("dispatch-index", dispatch_idx + 1);
		
		return svg_elem;									
	}
	
  _main.datum = function(_){
    if (!arguments.length) return data;
    data = _;
		
		range.x = [data[0].x, data[data.length-1].x];
		range.y = d3.extent(data.map(function(d) { return d.y; }));
		
    return _main;
  };
	
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
spec.d1.mainBrush = function(){
	var svg_elem, x, y, dispatcher;
	
	function _main(svg) {
		function changeRegion () {
			if (_brush.empty()){
				_brush.extent([0,0]);
				svg_elem.call(_brush);
				return;
    	}
	
			var e = {xdomain:_brush.extent().reverse()}
			_brush.clear();				
			svg_elem.call(_brush);
			svg.on("_regionchange")(e);
    };
		
		function peakdel () {
			if (_brush.empty()){
				_brush.extent([0,0]);
				svg_elem.call(_brush);
				return;
    	}
	
			var e = {xdomain:_brush.extent().reverse()}
			_brush.clear();
			svg_elem.call(_brush);
			dispatcher.peakdel(e);
    };

		function integrate () {
			if (_brush.empty()){
				_brush.extent([0,0]);
				svg_elem.call(_brush);
				return;
    	}
	
			var e = {xdomain:_brush.extent().reverse()}
			_brush.clear();
			svg_elem.call(_brush);
			dispatcher.integrate(e);
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
			.style('pointer-events', 'all');
		
		svg_elem.node().peakpickEnable = function (_) {
			svg_elem.classed("peakpick-brush", _)
			d3.select(".all-panels")
				.style("cursor", _? 'url('+cursor.peakpick+'), auto' : "auto");
		};
		svg_elem.node().peakdelEnable = function (_) {
			svg_elem.classed("peakdel-brush", _)
				.select(".background")
					.style("cursor", _? 'url('+cursor.peakdel+'), auto' : "crosshair");
			
			_brush.on("brushend", _? peakdel : changeRegion);
		};
		svg_elem.node().integrateEnable = function (_) {
			svg_elem.classed("integrate-brush", _)
				.select(".background")
					.style("cursor", _? 'url('+cursor.addinteg+'), auto' : "crosshair");
			
			_brush.on("brushend", _? integrate : changeRegion);
		};
	
		// Register event listeners
		var dispatch_idx = +svg.attr("dispatch-index");		
		dispatcher.on("peakpickEnable.brush."+dispatch_idx, svg_elem.node().peakpickEnable);
		dispatcher.on("peakdelEnable.brush."+dispatch_idx, svg_elem.node().peakdelEnable);
		dispatcher.on("integrateEnable.brush."+dispatch_idx, svg_elem.node().integrateEnable);
		svg.attr("dispatch-index", dispatch_idx + 1);
		
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
}
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
			.on("brushend", function () {//test x or y domain?
				var extent = _brush.empty()? brushscale.domain() : _brush.extent().reverse();
				extent = extent.sort(brushscale.domain()[0] > brushscale.domain()[1]?
					d3.descending : d3.ascending );
				
				svg.on("_regionchange")( x ? {xdomain:extent}	: {ydomain:extent} );
			})
		
		svg_elem = svg.append("g")
			.attr("class", "scale-brush")
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
		var dispatch_idx = +d3.select(".all-panels").attr("dispatch-index");
		dispatcher.on("rangechange.scalebrush."+dispatch_idx, svg_elem.on("_rangechange"));
		dispatcher.on("regionchange.scalebrush."+dispatch_idx, svg_elem.on("_regionchange"));
		dispatcher.on("redraw.scalebrush."+dispatch_idx, svg_elem.on("_redraw"));		
		d3.select(".all-panels").attr("dispatch-index", dispatch_idx + 1);
		
		
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
}
spec.d1.pp = function(){
	var svg_elem, x, y, dispatcher;
	
	function _main(svg) {
		var width = svg.attr("width"),
				height = svg.attr("height");
		
		var _peaks = [], _peaks_vis = [];
		
		svg_elem = svg.append("g")
			.attr("class", "peaks")
		
		svg_elem
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
						});
				
				
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
				 	});
	
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
		var dispatch_idx = +d3.select(".all-panels").attr("dispatch-index");
		dispatcher.on("regionchange.peaks."+dispatch_idx, svg_elem.on("_regionchange"));
		dispatcher.on("redraw.peaks."+dispatch_idx, svg_elem.on("_redraw"));		
		dispatcher.on("peakpick.peaks."+dispatch_idx, svg_elem.on("_peakpick"));
		dispatcher.on("peakdel.peaks."+dispatch_idx, svg_elem.on("_peakdel"));
		d3.select(".all-panels").attr("dispatch-index", dispatch_idx + 1);
		
		svg_elem.node().peaks = function(){return _peaks;};
		svg_elem.node().addpeaks = function(_){_peaks.push([_.x,_.y]);_peaks_vis.push([_.x,_.y]);};
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
}
spec.d1.main = function(){
  var data, data_slice, svg_width, svg_height, range={}, x, y, _peaks;
  var scale_brush;

  function d1main(svg){
    /* * Check variable definitions**/
    if (typeof data === 'undefined'){
        data = svg.datum();
        if (typeof data === 'undefined')
            throw new Error("nmr1d: no data provided.");
      
        svg.datum(null);    
    }
    if (typeof svg_width === 'undefined' || typeof svg_height === 'undefined'){
        svg_width = svg.attr("width");    svg_height = svg.attr("height");
        if (typeof svg_width === 'undefined' || typeof svg_height === 'undefined')
            throw new Error("nmr1d: chart width or height not defined.");
    }
    if (svg_width < 100 || svg_height < 100){
        throw new Error("nmr1d: Canvas size too small. Width and height must be at least 100px");
    }
		
		var brush_margin = 20;
		/*if(scale_brush.style() == "full")
			brush_margin = svg_height*0.2 -10;
		else if(scale_brush.style() == "slim")
			brush_margin = 20;
		*/		
    var margin = {
        top: 10 + brush_margin,
        right: 40,
        bottom: 20,
        left:10 + brush_margin
    };
  
  
  
		var width = svg_width - margin.left - margin.right,
        height = svg_height - margin.top - margin.bottom;
  
  
    x = d3.scale.linear().range([0, width]),
    y = d3.scale.linear().range([height, 0]);
  
    var xAxis = d3.svg.axis().scale(x).orient("bottom"),
        yAxis = d3.svg.axis().scale(y).orient("right")
          .tickFormat(d3.format("s"));
  
  
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

	
    svg.append("defs").append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("width", width)
        .attr("height", height);
  
		var all_panels = svg.append("g")
			.attr("class", "all-panels");		
		
		svg.call(spec.menu());
		
    var focus = all_panels.append("g")
        .attr("class", "main-focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("pointer-events", "all")
				.attr("width", width)
				.attr("height", height)
				.attr("dispatch-index", 0)
				.call(zoomer)
				.on("dblclick.zoom", null)
				.on("mousedown.zoom", null);
	
	
		
		
		// overlay rectangle for mouse events to be dispatched.
		focus.append("rect")
			.attr("width", width)
			.attr("height", height)
			.style("fill", "none");
			
		//axes	
		focus.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")");

		focus.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + width + ",0)");;
		
		//spectral lines
		focus.call(
			spec.d1.line()
				.datum(data)
				.xScale(x)
				.yScale(y)
				.dispatcher(dispatcher)
		);
		
		//brushes
		focus.call(
			spec.d1.mainBrush()
				.xScale(x)
				.dispatcher(dispatcher)
		);
				
		focus.call(
			spec.d1.scaleBrush()
				.xScale(x)
				.dispatcher(dispatcher)
		);
		
		focus.call(
			spec.d1.scaleBrush()
				.yScale(y)
				.dispatcher(dispatcher)
		);
			
		//peak picker	
		focus.call(
			spec.d1.pp()
				.xScale(x)
				.yScale(y)
				.dispatcher(dispatcher)
		);
		
		focus
			.on("_redraw", function(e){
				if(e.x)
					focus.select(".x.axis").call(xAxis);
				if(e.y)
					focus.select(".y.axis").call(yAxis);
				
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
					//TODO: don't attach range to datum!!
					var y0 = d3.max(focus.selectAll(".spec-line").data().map(function(d){return d.y[0]})),
					y1 = d3.min(focus.selectAll(".spec-line").data().map(function(d){return d.y[1]}));
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
			.on("mouseenter", function(e){
				dispatcher.mouseenter(e);
			})
			.on("mouseleave", function(e){
				dispatcher.mouseleave(e);
			})
			.on("mousemove", function(e){
				var new_e = d3.event;
				new_e.xcoor = d3.mouse(this)[0];
				new_e.ycoor = d3.mouse(this)[1];
				
				dispatcher.mousemove(new_e);
			})
			.on("click", dispatcher.click)
			.on("dblclick", function(){
				focus.on("_regionchange")({xdomain:range.x})
			});

		  
			
		var x0 = d3.max(focus.selectAll(".spec-line").data().map(function(d){return d.x[0]})),
				x1 = d3.min(focus.selectAll(".spec-line").data().map(function(d){return d.x[1]})),
				y0 = d3.max(focus.selectAll(".spec-line").data().map(function(d){return d.y[0]})),
				y1 = d3.min(focus.selectAll(".spec-line").data().map(function(d){return d.y[1]}));
	
		
		focus.on("_rangechange")({x:[x0,x1], y:[y0,y1]});
		
		
		/* testing peak picker */
		dispatcher.peakpick(data[1000]);
		dispatcher.peakpick(data[1110]);
		dispatcher.peakpick(data[1100]);
		dispatcher.peakdel({xdomain:[250, 195]});
		dispatcher.integrate({xdomain:[265, 260]});
		
		focus.select(".peaks").node().addpeaks(data[1200]);
		dispatcher.peakpick(data[1000]);
		
		registerKeyboard(svg);
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

  d1main.brush = function(x){
    if (!arguments.length) return scale_brush;
    scale_brush = x;
    return d1main;
  };

  d1main.xScale = function(xScale){
    if (!arguments.length) return x;
    x = xScale;
    return d1main;
  };

  d1main.yScale = function(yScale){
    if (!arguments.length) return y;
    y = yScale;
    return d1main;
  };
	d1main.peak_picker = function () {
		return _peaks;
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

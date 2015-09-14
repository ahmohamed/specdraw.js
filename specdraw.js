(function () { "use strict";
  var spec = {version: "0.5.2"}; // semver
	var pro = {};
	spec.globals = {};
	spec.globals.render = true;
	
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
// TODO: Needs a lot of debugging!!
// parent.class is undefined if the node doesn't have a class
// Similarly, parent.id
d3.selection.prototype.selectP =function(selector){
	var parent = this.node().parentNode;
	while(parent){       
		if(parent.matches(selector))
				return d3.select(parent);
		parent = parent.parentNode;
	}
	return null;
};
d3.selection.prototype.toggleClass = function(class_name){
	return this.classed(class_name, !this.classed(class_name));
};
var whichMax = function (arr) {
	if (!arr.length || arr.length === 0)
		return null;
		
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
var fireEvent = function(element,event){
    if (document.createEventObject){
    // dispatch for IE
    var evt = document.createEventObject();
    return element.fireEvent('on'+event,evt)
    }
    else{
    // dispatch for firefox + others
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent(event, true, true ); // event type,bubbling,cancelable
    return !element.dispatchEvent(evt);
    }
};
var launchFullScreen = function(element) {
console.log('go full screen');
if (element.requestFullscreen)
{ element.requestFullscreen(); }
else if (element.mozRequestFullScreen)
{ element.mozRequestFullScreen(); }
else if (element.webkitRequestFullscreen)
{ element.webkitRequestFullscreen(); }
else if (element.msRequestFullscreen)
{ element.msRequestFullscreen(); }
};
function isFullScreen(){
 return document.fullscreenElement ||
	document.mozFullScreenElement ||
	document.webkitFullscreenElement ||
	document.msFullscreenElement;
}
function toggleFullScreen(element) {
  if (!isFullScreen() ) {  // current working methods
		launchFullScreen(element);
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

function guid(){
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
		/[xy]/g, function(c) {
			var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;
			return v.toString(16);
		}
	);
}
var css_trans = function(transform){
  return function(svg){
    svg.style({
      "transform": transform,
      "-webkit-transform":transform,
      "-moz-transform":transform,
      "-o-transform":transform
    });
  }
};


var sliceDataIdx = function(data, domain, range){
  var datalen = data.length*(domain[0] - domain[1])/(range[0]-range[1]);

  var dataResamplestart = data.length*(domain[0] - range[0])/(range[1]-range[0]);
  return {start:dataResamplestart, end:dataResamplestart+datalen};	
};
var getSlicedData = function (data, domain, range) {
	var slice_idx = sliceDataIdx(data, domain, range);
	return data.slice(slice_idx.start, slice_idx.end);
};
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
	var svg_width = svg.attr("width"),
			svg_height = svg.attr("height");
	
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

var searchNMRShiftDB = function (){
	var base = 'http://nmrshiftdb.org/portal/js_pane/P-Results/nmrshiftdbaction/searchBySpectrumSpec/spectrumtypespectrumsearch/1/suborwhole/whole/spectrum/'
	var peak_str = ''
	d3.select('.peaks')
		.selectAll('text').each(function(){ 
			peak_str += (this.childNodes[0].nodeValue+'%0A');
		});
  var a = document.createElement("a");
  a.href = base + peak_str;
	a.target = '_blank'
  a.click();
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



var clr_space = ["#5e94e5", "#26aa0e", "#fd5f11", "#fe25fb", "#a6906a", "#f75a93", "#02a783", "#b974f3", "#969904", "#b684a5", "#e07559", "#6a9baa", "#cd8313", "#fd45c6", "#69a24d", "#d46fbf", "#769c7d", "#a584d2", "#d77786", "#af9039", "#fb5d67", "#0f9ed1", "#04aa53", "#e258ed", "#8587f9", "#6ca313", "#8692be", "#0ca4a3", "#9f9091", "#bf8578", "#e4742d", "#c8844a", "#8a9a5c", "#fa6046", "#df6d9f", "#ef5cb3", "#fe37e0", "#d46ad9", "#859d36", "#5aa26f", "#4aa734", "#4b92ff", "#ed6780", "#c07db8", "#bc79d9", "#b88d0d", "#839891", "#26a868", "#0ca2b7", "#5c9f97", "#a388be", "#a0944f", "#ce7f65", "#6097d1", "#878ed2", "#878be5", "#b68c57", "#e66e6d", "#ca7b9f", "#d87b43", "#c869fa", "#8f9777", "#fd587a", "#8f93a4", "#eb5acc", "#c68632", "#b4888b", "#57a183", "#f045f4", "#0e98f9", "#a87eec", "#01aa3c", "#dc7a03", "#a7931a", "#619abe", "#a08cab", "#f7652f", "#fe4ab3", "#289ae5", "#67a335", "#4ca64c", "#ef6d0c", "#9e9638", "#829e15", "#51a710", "#a68f7e", "#c5808b", "#ec6d45", "#ee6a5a", "#f04fda", "#be8764", "#8f9947", "#779e69", "#d67972", "#29a590", "#d075ac", "#fe4fa0", "#d57e2b", "#e25ce0", "#4ca562", "#759f5b", "#c677c5", "#dd68c6", "#259fc4", "#ef60a0", "#e0708c", "#ef638d", "#959663", "#bf7fab", "#ca6ced", "#fe5c54", "#7b9e46", "#c572df", "#47a0aa", "#a67cf9", "#a98b98", "#7f95b1", "#979384", "#829984", "#6c90ec", "#e16aac", "#84969e", "#519db7", "#ce7d7f", "#44a47c", "#b381c5", "#c2881e", "#699f76", "#6b9c9d", "#379bd8", "#b68a71", "#a3925d", "#e154fa", "#cf813b", "#f46274", "#d27e51", "#849a70", "#93992e", "#9f83e5", "#b98b41", "#78a02d", "#f552c0", "#df7379", "#ff5387", "#d77499", "#31a92a", "#fe2fed", "#fe3fd3", "#35a844", "#f04ae7", "#6e93d8", "#e3743d", "#b18f27", "#ad9048", "#43a296", "#35a75a", "#b483b8", "#cf70cc", "#de7566", "#918ec5", "#b37fd2", "#6f96c4", "#928ad8", "#f16667", "#c18757", "#c18198", "#6f9d8a", "#b38c64", "#b28a7e", "#29a775", "#ce7b92", "#929491", "#9c9377", "#b58698", "#718df9", "#cc7f72", "#64a25b", "#7b92cb", "#509acb", "#998db8", "#9b89cb", "#e267b9", "#e67407", "#8f91b1", "#aa88b1", "#e1754b", "#9682f9", "#ee6d25", "#bb8b31", "#ed6d36", "#d663ed", "#ea5ec0", "#d55ffa", "#cb76b9", "#7b8fdf", "#f23dfa", "#f5654d", "#fb6038", "#da7b34", "#aa80df", "#c48642", "#8e9b24", "#ff586e", "#9484f3", "#cb832a", "#75a03e", "#9c85df", "#42a56f", "#e86893", "#0399f2", "#4d98de", "#4695f2", "#fb50ad", "#eb61ac", "#e36f80", "#f756a6", "#9a9725", "#d472b2", "#be8949", "#f75e80", "#ba76e6", "#ee55d3", "#fc6027", "#ca825e", "#f6653f", "#6aa062", "#7e9d55", "#4c9cc4", "#bb71fa", "#54a554", "#1da3aa", "#828af2", "#d57c5f", "#5aa445", "#c2856b", "#9d8ea4", "#c76fe6", "#f8641d", "#41a1a3", "#57a090", "#749b90", "#ab9056", "#aa89a5", "#ba895e", "#9a956a", "#aa8d84", "#af8e5d", "#6e99b1", "#939855", "#c18385", "#969297", "#9b928b", "#8e968a", "#789a97", "#a882d8", "#6fa054", "#13a961", "#99909e", "#e4725f", "#d16dd3", "#4993f9", "#ae8c78", "#819c62", "#db7b22", "#e064cc", "#7898a4", "#97983f", "#a686c5", "#899c01", "#1ba1bd", "#93957d", "#9186ec", "#d27c6c", "#d77e15", "#f76161", "#bd7bcc", "#c575d2", "#5b9ea4", "#7b97aa", "#4397eb", "#aa8e71", "#ad910a", "#44a389", "#bd8392", "#ab9230", "#ec6499", "#1ca689", "#a99240", "#8394b7", "#6e8ef2", "#6a9e83", "#c879b2", "#1596ff", "#e66c86", "#cd78a5", "#e865a6", "#8d9869", "#9c9647", "#e96b7a", "#7197b7", "#b28e4f", "#4c9eb0", "#a29507", "#c0893a", "#d871a6", "#c37abf", "#d18121", "#62a421", "#53a468", "#ea7019", "#dc7852", "#57a52b", "#e07717", "#879b4e", "#d466e6", "#43a81f", "#8a9b3f", "#e67152", "#72a122", "#52a63d", "#f54dcd", "#e360d3", "#fb559a", "#f258b9", "#f642e7", "#e1726c", "#f45ba0", "#e856e0", "#d87b4b", "#fb39e7", "#f63cf4", "#db5afa", "#d95ef3", "#39a83c", "#f847d3", "#e852ed", "#dc6bb9", "#cc74c5", "#fa614d", "#bc8b28", "#fa4cc0", "#df5de6", "#dc7199", "#e87136", "#35a91f", "#e96e60", "#ef6773", "#40a82a", "#f25f93", "#cc68f3", "#b47ae6", "#d76cc6", "#ea4cf4", "#29a853", "#ad78f9", "#da748c", "#e77145", "#eb6d4c", "#e563bf", "#3fa661", "#f941e0", "#5ca43d", "#f349e0", "#ed46fa", "#60a42b", "#ab7bf3", "#59a520", "#20a944", "#d766e0", "#6da13e", "#ba80b8", "#c27fa5", "#ad85b8", "#55a276", "#889a63", "#658ff9", "#7ba015", "#cc8151", "#61a083", "#889977", "#c98265", "#a680e6", "#b08b85", "#28a1b0", "#948ccb", "#928fb8", "#7e9e36", "#419cca", "#f3627a", "#c68272", "#63a16f", "#7e8de5", "#c3837f", "#1b9dd8", "#8990c4", "#8a8dd8", "#b782b2", "#a38e98", "#c68629", "#a984cb", "#9c8bbe", "#50a55b", "#e85ec6", "#6da05b", "#7596be", "#e86e66", "#6897cb", "#fa5d6e", "#df7835", "#32a396", "#bc82a5", "#839c5c", "#d37e43", "#f26660", "#b28c6b", "#d57e34", "#7e91d1", "#9e9371", "#dd7844", "#60a176", "#729f62", "#829d46", "#a09525", "#ba868b", "#da795f", "#c68457", "#61a262", "#ba7ec5", "#a48ab1", "#559bbe", "#c87e92", "#dd64d3", "#b88b49", "#f8615a", "#d57979", "#bd876b", "#8d9b2e", "#cf7f5e", "#f253c6", "#d8767f", "#9e87d2", "#ba8878", "#6f9aa4", "#d173b9", "#32a66f", "#d37c65", "#3da483", "#2fa2a3", "#9488df", "#919770", "#b385ab", "#7c9c70", "#599ac4", "#c8807f", "#97965c", "#f054cd", "#8b93ab", "#71a12c", "#e466b3", "#a89064", "#8d85f9", "#999655", "#6c9f6f", "#7192de", "#73a046", "#599db1", "#6092ec", "#7e9b7d", "#f656ad", "#cb8333", "#d67c58", "#779f54", "#439fb7", "#cc7d85", "#f55e87", "#ad83c5", "#8a9784", "#c57cac", "#e369a6", "#c98442", "#c88611", "#b081cb", "#998fab", "#719e76", "#3ca576", "#9c81f3", "#c67e98", "#d97492", "#a59256", "#a29263", "#e76999", "#51a096", "#6b9d90", "#3c9ade", "#8f9497", "#a39440", "#f9598d", "#4ba290", "#b28991", "#6b95d1", "#a29177", "#de7093", "#c38192", "#809897", "#a59430", "#8895a4", "#779b8a", "#d07a8c", "#ac9127", "#4098e5", "#5499d1", "#5b96de", "#7894c4", "#ea688d", "#a89248", "#cc7b98", "#569f9d", "#a28f8b", "#b3879e", "#a9905d", "#a68c9e", "#b58d39", "#999291", "#b38f0c", "#7295cb", "#d5759f", "#25a49d", "#a38ca4", "#fd50a7", "#7c989d", "#7399aa", "#b68885", "#a88f77", "#85997d", "#ae8b8b", "#819a76", "#6f9c97", "#36a1aa", "#ca7d8c", "#c0875e", "#ac8b91", "#a0917e", "#a58d91", "#879697", "#f951b3", "#8192c4", "#8b9691", "#7b9b83", "#ac8d7e", "#9c9705", "#49a19d", "#95948a", "#919584", "#8495aa", "#65a07d", "#91993f", "#8793b1", "#a08e9e", "#5ba17c", "#7797b1", "#969847", "#659ca4", "#bd7fb2", "#7f998a", "#8b949e", "#8097a4", "#92929e", "#ca8078", "#b98964", "#c38649", "#c78085", "#b58c5d", "#9690a4", "#5d99cb", "#87978a", "#c47e9f", "#8f9863", "#df6ab2", "#8c977d", "#3aa29d", "#8490cb", "#7c9a90", "#b78d28", "#af8998", "#9d945c", "#9a937e", "#8c9a55", "#5f9caa", "#cf7d79", "#9291ab", "#bd8b0f", "#fb5981", "#ad899e", "#b8887e", "#968fb1", "#2c9eca", "#949924", "#5ca08a", "#9d8db1", "#b48a78", "#51a289", "#99972f", "#9e9184", "#a88d8b", "#91985c", "#9c9463", "#b982ab", "#969577", "#749a9d", "#9c9097", "#a78aab", "#6598c4", "#8c8ecb", "#1ca77c", "#be819f", "#d672ac", "#bb8957", "#649bb1", "#3c9ec4", "#a48f84", "#988bc5", "#ae8e64", "#669e8a", "#aa9238", "#d067ed", "#f5626d", "#c28750", "#fe5c4d", "#c66cf3", "#8f8cd2", "#2aa683", "#9a964e", "#889c16", "#44a745", "#4ba383", "#dd784b", "#93966a", "#ed60a6", "#ad87ab", "#ee677a", "#9f89c5", "#b38e48", "#44a65a", "#da7679", "#989737", "#8b87f3", "#39a668", "#f0666d", "#b57cd9", "#f45f8d", "#aa86be", "#b087a5", "#da7b2c", "#d77b51", "#f15f99", "#bd8b1d", "#7a9d62", "#d96eb2", "#e961b3", "#5ba35b", "#ce6ed9", "#fd5c5a", "#cb6edf", "#f66546", "#cc71d2", "#bf70f3", "#6f9f69", "#e762b9", "#57a362", "#b08f30", "#6992e5", "#ac904f", "#df755f", "#21aa1e", "#64a412", "#e17552", "#d28014", "#f4680d", "#30a0b7", "#799f4d", "#71a04d", "#7490e5", "#da68cc", "#848ddf", "#a382df", "#77a036", "#e55bd9", "#9987d8", "#6fa135", "#ce8143", "#f06386", "#229cde", "#bc8685", "#47a568", "#ac82d2", "#f0694c", "#94984e", "#bf838b", "#f9640f", "#f26380", "#b278f3", "#63a345", "#6899b7", "#849d3e", "#799c76", "#d37a7f", "#38a90f", "#ec6a66", "#e07273", "#d97965", "#8e9a4e", "#c18829", "#f86427", "#d375a5", "#ef6a53", "#30a84c", "#c18572", "#5096e5", "#a6924f", "#cd6be6", "#ea6b73", "#65a33d", "#619f90", "#2fa761", "#4999d8", "#f3692f", "#4fa720", "#749e70", "#a49438", "#dc7b16", "#ae9041", "#f16945", "#dc766c", "#489dbd", "#5ea269", "#ef6d1b", "#6495d8", "#ea65a0", "#6391f2", "#cb79ac", "#369fbd", "#a69326", "#4fa645", "#ed6d3e", "#57a44c", "#5891f9", "#48a653", "#8c9b37", "#809d4d", "#d08133", "#e263c6", "#e57424", "#ee6d2e", "#e86b80", "#d67e21", "#b879df", "#d5778c", "#bd7dbf", "#3ca390", "#818fd8", "#2da934", "#9d9640", "#7f9c69", "#da65d9", "#b085b2", "#cd7f6c", "#cc8320", "#549eaa", "#f1693e", "#16a94c", "#619d9d", "#db7858", "#ea7124", "#6e9e7d", "#a37ef3", "#d17a85", "#eb55d9", "#7e94be", "#b9849e", "#8c8bdf", "#b68d31", "#de6ea6", "#819e23", "#b78692", "#ea7009", "#e36c93", "#b78a6b", "#5ba511", "#c08932", "#ac8e6a", "#fb603f", "#b17cdf", "#1baa2a", "#a185d8", "#47a73d", "#f752b9", "#768eec", "#c5845e", "#808cec", "#f96154", "#a287cb", "#9786e5", "#34a57c", "#c8826b", "#739d83", "#c974cc", "#a29447", "#d17c72", "#e6714c", "#859b55", "#c872d9", "#dd737f", "#3da0b0", "#fd601e", "#6ba321", "#f3691c", "#fe5874", "#e07723", "#cd814a", "#ac911b", "#ce76b2", "#b475fa", "#69a32c", "#d37792", "#b780bf", "#9984ec", "#c67ab8", "#fb40da", "#4aa476", "#f343ed", "#e56f73", "#67a169", "#50a37c", "#f36926", "#c78451", "#9f952f", "#6b98be", "#899b46", "#55a534", "#9b9719", "#f46553", "#bd8950", "#c5863a", "#989570", "#cb8158", "#7b8af9", "#c26dfa", "#ea6e53", "#7aa022", "#be76df", "#5897d8", "#8f9b17", "#c37cb2", "#e8713d", "#d769d3", "#e57418", "#20a95a", "#bb8498", "#d76fb9", "#978ad2", "#e17086", "#2d99eb", "#ff5b47", "#f26937", "#c48465", "#c370ed", "#b78d1d", "#01a875", "#8b9970", "#ca843b", "#4fa46f", "#b28f1c", "#e27544", "#d17899", "#df782c", "#909b02", "#8e90be", "#5ea435", "#67a254", "#a79308", "#7d9e3e", "#46a80f", "#74a114", "#40a74c", "#de783c", "#9e7ff9", "#df59f4", "#a181ec", "#f85e7a", "#d17f58", "#c58278", "#a788b8", "#c87ca5", "#bf78d2", "#cf73bf", "#4da72b", "#e17705", "#da6bbf", "#dc7386", "#c7861f", "#db7673", "#e557e6", "#da719f", "#bf8942", "#bd857e", "#b97bd2", "#e5699f", "#27a93c", "#d16ae0", "#879c23", "#11aa33", "#c977bf", "#cf789f", "#e56c8c", "#e9712e", "#5d9bb7", "#8a91b7", "#8989ec", "#1aa86f", "#af7fd9", "#bd73ec", "#c275d9", "#60a34d", "#b67ecc", "#6ba145", "#b08c71", "#f66167", "#929937", "#df67bf", "#ba8b3a", "#9f9456", "#7f9e2d", "#3496f9", "#e47435", "#ad7de6", "#fc4bba", "#a08ab8", "#ed6a60", "#ed6493", "#c173e6", "#a1951a", "#459bd1", "#798cf2", "#958dbe", "#f95d74", "#17a596", "#af7aec", "#fc6030", "#eb6b6d", "#d27e4a", "#e16d99", "#6794de", "#d46ccc", "#3794ff", "#5693f2", "#ea6e59", "#34a489", "#c07ac5", "#4f9fa3", "#b48d41", "#7891d8", "#869d2d", "#eb6886", "#d97b3c", "#3197f2", "#b08e56", "#d170c6", "#959918", "#7593d1", "#a0936a", "#5ea354", "#c378cc", "#d7796c", "#f3665a", "#3da834", "#669d97", "#7a96b7", "#d0812b", "#f76537", "#8f88e5", "#fc5c61", "#c28810", "#7c9d5c", "#869a69", "#d77d01", "#db6eac", "#3ba753", "#329dd1", "#e46f79", "#a49171", "#b677ec", "#bb8771", "#e37266", "#e57259", "#5395ec", "#e666ac", "#d47e3c", "#b083be", "#b78b50", "#e060d9", "#fb46cd", "#fe548d", "#fa5987", "#f833fb", "#d962e6", "#e453f4", "#ed4bed", "#ff44c0", "#d263f3", "#f34ed3", "#ec5db9", "#ef58c0", "#f93aed", "#f25ba6", "#cf64fa", "#ed59c6", "#dd61e0", "#ee50e0", "#dc5eed", "#eb51e7", "#f648da", "#f955a0", "#f15cad", "#fb31f4", "#e55fcc", "#f84dc6", "#e85ad3", "#f65a9a", "#fc5494", "#f457b3", "#e74dfa"];
var highlight = function (line_idx, on) {
	var classname = '.clr' + line_idx;
	d3.select('.spec-slide.active').selectAll('.line')
		.classed('disabled', on);
	
	d3.select('.spec-slide.active').selectAll(classname)
		.classed('disabled', false);
}

var events = {
	crosshair:true,
	peakpick:false,
	peakdel:false,
	integrate:false,
	zoom:["x", "y", false]
}

events.crosshairToggle = function (app) {
	events.crosshair = !events.crosshair;
	app.slideDispatcher.crosshairEnable(events.crosshair);
}

events.peakpickToggle = function (app) {
	if(events.zoom[0] !== false)	events.zoom.rotateTo(false);	
	if(events.peakdel !== false)	events.peakdelToggle(app);
	if(events.integrate !== false)	events.integrateToggle(app);
	
	console.log(events.zoom)
	events.peakpick = !events.peakpick;
	app.slideDispatcher.peakpickEnable(events.peakpick);
}

events.peakdelToggle = function (app) {
	if(events.zoom[0] !== false)	events.zoom.rotateTo(false);	
	if(events.peakpick !== false)	events.peakpickToggle(app);
	if(events.integrate !== false)	events.integrateToggle(app);	
	
	events.peakdel = !events.peakdel;
	app.slideDispatcher.peakdelEnable(events.peakdel);	
}

events.integrateToggle = function (app) {
	if(events.zoom[0] !== false)	events.zoom.rotateTo(false);	
	if(events.peakpick !== false)	events.peakpickToggle(app);
	if(events.peakdel !== false) events.peakdelToggle(app);

	events.integrate = !events.integrate;
	app.slideDispatcher.integrateEnable(events.integrate);	
}

events.zoomToggle = function (app) {
	if(events.peakpick !== false)	events.peakpickToggle(app);
	if(events.peakdel !== false)	events.peakdelToggle(app);
	if(events.integrate !== false)	events.integrateToggle(app);	
	
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

var registerKeyboard = function(app){
	console.log(app)
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
			app.slideDispatcher.log("keyCode: " + d3.event.keyCode);
			
			if (d3.event.keyCode===80) { // p
				events.peakpickToggle(app);
			}else if (d3.event.keyCode===68) { // d
				events.peakdelToggle(app);
			}else if (d3.event.keyCode===73) { // i
				events.integrateToggle(app);
			}else if (d3.event.keyCode===67) { // c
				events.crosshairToggle(app);
			}else if (d3.event.keyCode===70) { // f
				dispatcher.regionfull(app);
			}else if (d3.event.keyCode===90) { // z
				events.zoomToggle(app);
			}
			
			
			app.slideDispatcher.keyboard(d3.event);
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


var inp = {};
inp.num = function (label, val, _min, _max, step, unit) {
	var elem = d3.select(document.createElement("label"));
	elem.classed('param num', true)
		.text(label)
		.append("input")
			.attr({
				type: 'number',
				value: typeof val === "undefined" ? 0: val,
				min: typeof _min === 'undefined'? -Infinity: _min,
				max: typeof _max === 'undefined'? Infinity: _max,
				step: typeof step === 'undefined'? 1: step
			})
			.text(typeof unit === 'undefined'? '': unit);
	
	elem.node().getValue = function(){ 
		return elem.select('input').node().value;
	};
	return function () { return elem.node()	}
};

inp.checkbox = function (label, val) {
	var elem = d3.select(document.createElement('label'));
	elem.classed('param checkbox', true)
		.append("input")
			.attr('type', 'checkbox')
      .on('change', function () {
        fireEvent(this, 'input');
      })
      .node().checked = val ? true: false;
	
	elem.append('div')
			.classed('checker', true);
  elem.append('div')
		.classed('label', true)
		.text(label);
	
	elem.node().getValue = function(){ 
		return elem.select('input').node().checked;
	};
	return function () { return elem.node()	}
};
inp.checkbox_toggle = function (label, val, div_data) {
	var elem = d3.select(document.createElement('div'))
    .classed('param checkbox-toggle', true);
  
  elem.append(inp.checkbox(label, val))
    .select('input').on('change', function () {
      elem.select('.div_enable')
        .classed('disabled', !this.checked);
      fireEvent(this, 'input');
    });
	
  elem.append(inp.div(div_data))
		.classed('div_enable', true)
  	.classed('disabled', !elem.select('input').node().checked);
		
  elem.node().getValue = elem.select('.param.checkbox').node().getValue;
  
  return function () { return elem.node();	};
};
inp.select = function (label, options, val) {
	var elem = d3.select(document.createElement('label'))
		.classed('param select', true)
		.text(label);
	var select_elem = elem.append("select");
  
  select_elem.selectAll('option')
		.data(options).enter()
		.append('option')
			.text(function(d){return d;});
  
  select_elem.node().value = val;
  
	elem.node().getValue = function(){ 
		return select_elem.node().value;
	};
	return function () { return elem.node()	}
};

inp.select_multi = function (label, options) {
	var elem = d3.select(document.createElement('div'))
    .classed('param select-multi', true);
  
	elem.append('label')
    .text(label)
		.append("input")
			.attr('type', 'checkbox')
			.style('display', 'none')
      .on('change', function () {
        elem.select('ul')
          .classed('shown', this.checked);
      })
			.node().checked = false;
	
	elem.append('ul')
		.classed('block-list', true)
		.selectAll('li')
		.data(options).enter()
		.append('li')
			.each(function(d){
        d3.select(this).append(inp.checkbox(d, true))
      });
	
	elem.node().getValue = function(){ 
		return elem.selectAll('.param.checkbox')
			.filter(function () {
				return this.children[0].checked;
			})[0]
			.map(function (e) {
				return typeof(e.value) !== 'undefined' ? e.value
					: d3.select(e).select('.label').text();
			});
		return elem.select('input').node().value;
	};
	return function () { return elem.node()	}
};

inp.select_toggle = function (label, options) {
	console.log(label, options);
	var elem = d3.select(document.createElement('div'))
    .classed('param select-toggle', true);
  
  elem.append(inp.select(label, Object.keys(options))) 
	  .selectAll('option')
      .attr('value', function(d){return d;})
      .text(function(d){return options[d][0];});
	
	var fieldset = elem.append("div")
		.classed("method_params", true);
	var select_elem = elem.select('select').node();
	
	elem.select('select').on('input', function () {
    d3.event.stopPropagation();
  })
    .on('change', function () {
		fieldset.select('fieldset').remove();

		if( Object.keys( options[select_elem.value][1]).length > 0 ){
			fieldset.append("fieldset")
				.append(inp.div( options[select_elem.value][1] ))
				//.appened('legend', 'Parameters');
		}
    
    fireEvent(this.parentNode, 'input');
	});
	
	if( Object.keys(options[ select_elem.value ][1]).length > 0 ){
		fieldset.append("fieldset")	
			.append(inp.div( options[ select_elem.value ][1] ));
	}
	
	elem.node().getValue = function(){ 
		return select_elem.value;
	};
	return function(){return elem.node();};
};
inp.button = function (label) {
	var elem = d3.select(document.createElement('input'))
		.classed('param btn', true)
		.attr('type', 'button')
		.attr('value', label)
		.on("click", function(){ fireEvent(this, 'input') });
	
	elem.node().getValue = function(){ 
		return d3.event && d3.event.target === elem.node();
	};	
	return function(){return elem.node();};
};
inp.threshold = function (label) {
	var elem = d3.select(document.createElement('div'))
	.classed('param threshold', true);
	
	var input = elem.append("input").attr("type", "hidden")

	var val = elem.append("input")
		.attr("type", "text")
		.attr('readonly', 'readonly');
	
	elem.insert(inp.button(label), ':last-child')
  	.on("click", function(){ 
			var modal = d3.selectAll(".nanoModalOverride:not([style*='display: none'])")
				.style('display', 'none');
			
			d3.select('.spec-slide.active').select('.main-focus').node()
				.getThreshold(function (t) {
					val.attr('value', t.toExponential(2));
					input.attr('value', t);
					modal.style('display', 'block');
				});
		});
	
	elem.node().getValue = function () {
		return input.node().value;
	};
	return function(){return elem.node()}
};
/* parses the GUI data into a div HTML element.
	 @param div_data object containing parameter names as keys
	 and GUI information (Array) as values.
	 The GUI array consists of the following:
	 * label: text label of the input
	 * type: the input type:
			0:number 1:checkbox 2:text 3:select_toggle 4:checkbox_toggle
			5:button 6:threshold
*/
inp.div = function (div_data) {
	var div = d3.select(document.createElement('div'));
  for (var key in div_data){
		var p = div_data[key];
		if(typeof p == 'function') continue; //Exclude Array prototype functions.
    div.append(parseInputElem.apply(null, p))
			.node().id = key;
  }
	
	return function() {return div.node();};
};

var parseInputElem = function (label, type, details) {
	var f = [
		inp.num, inp.checkbox, inp.text, inp.select_toggle,
		inp.checkbox_toggle, inp.button, inp.threshold
	][type];
	return f.apply(null, [label].concat(details));
};

inp.spectrumSelector = function () {
	var specs = d3.select('.spec-slide.active').select(".main-focus").selectAll(".spec-line")
	if (specs.size() === 0){
		return function () {
			return d3.select(document.createElement('div')).text('No Spectra to show').node();
		};
	} 
		
	var elem = 	d3.select(
			inp.select_multi('Select Spectrum', specs[0])()
		).classed('spec-selector', true)
	
	elem.selectAll('li')
	  	.each(function(d){
				d3.select(this).select('.checkbox')					
					.style('color', getComputedStyle(d.childNodes[0]).stroke)
					.select('.label').text(d.label);
					
				d3.select(this).on('mouseenter', function () {
						d3.select(d.parentNode).classed('dimmed', true);
						d3.select(d).classed('highlighted', true);
					})//mouseover
					.on('mouseleave', function () {
						d3.select(d.parentNode).classed('dimmed', false);
						d3.select(d).classed('highlighted', false);
					});//mouseout
			});//end each
	
	elem.node().getValue = function () {
		return elem.selectAll('li')
			.filter(function () {
				return d3.select(this).select('input').node().checked === true;
			})
			.data().map(function(e){
	        return e.s_id();
	    });
	};
	elem.node().id = 'sid';
	
	return function(){return elem.node();};
};
inp.preview = function(auto){
	var div_data = {
		"prev_auto":["Instant Preview", 1, typeof auto !== 'undefined'],
		"prev_btn":["Preview", 5, null],
	};
	return inp.div(div_data);
};
inp.popover = function (title) {
	var div = d3.select(document.createElement('div'))
		.classed('popover right', true);
	
	div.append('div').classed('arrow', true);
	var inner = div.append('div').classed('popover-inner', true)
	inner.append('h3').classed('popover-title', true).text(title);
	inner.append('div').classed('popover-content', true);
	
	return function() {return div.node();};
}

var modals = {
	crosshair:true,
	peakpick:false,
	peakdel:false,
	integrate:false,	
}

nanoModal.customHide = function(defaultHide, modalAPI) {
	modalAPI.modal.el.style.display = 'block';
	defaultHide();
};
	
modals.proto = function (title, content, ok_fun, cancel_fun) {	
	var nano = nanoModal(
		content,
		{
		overlayClose: false,
		autoRemove:true,
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
		]}
	);
	
	//TODO: define spec-app;
	var spec_app = d3.select('.spec-app');
	spec_app.append(function () {return nano.overlay.el});
	spec_app.append(function () {return nano.modal.el});
	
	var el = d3.select(nano.modal.el);
	
	el.insert("div", ":first-child")
		.classed('title', true)
		.text( title? title : "Dialogue" );
	
	el.on("keydown", function() {
		if (d3.event.keyCode===13) { // Enter
			d3.select(nano.modal.el).select(".nanoModalBtnPrimary").node().click();
		}
		if (d3.event.keyCode===27) { // Escape
			d3.select(nano.modal.el).select(".cancelBtn").node().click();
		}
	});
	
	nano.onShow(function () {
		el.style({
			'display': 'flex',
			'flex-direction': 'column',
			'margin-left': -el.node().clientWidth /2,
			'max-width': 0.8 * el.node().parentNode.clientWidth,
			'max-height': 0.8 * el.node().parentNode.clientHeight
		});
		var drag = d3.behavior.drag()
			.on("drag", function () {
		    el.style("top", d3.event.sourceEvent.pageY+"px")
		      .style("left", d3.event.sourceEvent.pageX+"px")				
			});
		d3.select(nano.modal.el).select(".title").call(drag)
		d3.select(nano.modal.el).select(".cancelBtn").node().focus();
		
		//{display: flex,flex-direction: column}
	});
	return nano;
}

modals.error = function (title, message) {
	var nano = modals.proto('Error:' + title, message);
	d3.select(nano.modal.el)
		.classed('errorModal', true)
		.select('.cancelBtn').text('Dismiss');
	nano.show();
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
		
	var nano = modals.proto("Range", content,
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
		
	var nano = modals.proto("Numeric", content,
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
		d3.select('.spec-slide.active').select(".main-focus").node().range.x,
		function (new_range) { d3.select('.spec-slide.active').select(".main-focus").on("_regionchange")({xdomain:new_range}); },
		d3.select('.spec-slide.active').select(".main-focus").node().xScale.domain()
	)();
};

modals.yRegion = function () {
	modals.range(
		"Set y region to:\n",
		d3.select('.spec-slide.active').select(".main-focus").node().range.y,
		function (new_range) { d3.select('.spec-slide.active').select(".main-focus").on("_regionchange")({ydomain:new_range}); },
		d3.select('.spec-slide.active').select(".main-focus").node().yScale.domain()
	)();
};

modals.slider = function (text, value, callback){	
	var content = text +
		'<input id="slider" type="range" min="-5" max="5" value="0" step="0.001"/>';
		
	var nano = modals.proto("Slider", content,
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
};

modals.methods = function (fun ,args, title, specSelector, preview) {
	var el;
	var preview = true;
	
	var ok_fun = function (modal) {
		preview = false;
		fireEvent(el.node(), 'input');
		modal.hide();
	};
	
	var nano = modals.proto(title, '',	ok_fun);
	el = d3.select(nano.modal.el).select(".nanoModalContent");
	
	
	var timer = null;
	el.on('input', function () {
		var form_data = {};
    el.selectAll('.param')
      .filter(function () {
        return this.id !== '';
      })
      .each(function (e) {
        form_data[this.id] = this.getValue();
      });
		
		if(timer)
			clearTimeout(timer);		
		
		if(preview === false || 
			d3.event.target === el ||
			form_data['prev_btn'] === true){
			pro.plugin_funcs(fun, form_data, form_data['s_id'], preview);
		}else	if(form_data['prev_auto'] === true){
			timer = setTimeout(function () {
				pro.plugin_funcs(fun, form_data, form_data['s_id'], true);
			}, 300);
		}
	});
	
	el.append(inp.spectrumSelector());
	el.append(inp.div(args));
	el.append(inp.preview(true));
	return nano.show;
};
spec.modals = modals;
spec.menu = function(){	
	function toggle(e){
	  if(d3.event.target !== this) return;
  
	  var button = d3.select(this).toggleClass('opened');
	  button.select('.tooltip')
	    .style('display', button.classed('opened')? 'none': null);
	}
	function _main(app) {
		var column_menu_buttons = [
		  ['open-menu', 'Menu'],
		  ['open-spec-legend', 'Spectra'],
		  ['open-slides', 'Slides'],
		  ['open-settings', 'Settings'],
		  ['open-download', 'Download Spectra'],
		  ['open-fullscreen', 'Fullscreen App'],
		  ['connection-status', 'Connection Status'],
		];
		
		var elem = app.append('div')
			.classed('column-menu', true);
			
		elem.selectAll('div')
		  .data(column_menu_buttons).enter()
		  .append('div')
		  .attr('class', function(d){return d[0]})
		  .attr('title', function(d){return d[1]})
		  .call(bootstrap.tooltip().placement('right'))
		  .on('click', toggle);
		
		elem.select('.open-menu').call(spec.menu.main_menu()); 
		
		
		var app_dispatcher = app.node().dispatcher;
		
		
		// Full screen manipulation
		elem.select('.open-fullscreen')
			.on('click', function (e) {
				toggleFullScreen(app.node());
				toggle.apply(this);
			});
		
		d3.select(window).on('resize.fullscreenbutton', function () {
			elem.select('.open-fullscreen').classed('opened', isFullScreen());
		});
		/**************************/
		
		app_dispatcher.on('menuUpdate.menu', function () {
			elem.select('.open-menu').call(spec.menu.main_menu());
		});
		app_dispatcher.on('slideChange.menu', function () {
			//TODO: hide parent menu-item when all children are hidden
			var two_d_slide = app.select('.spec-slide.active').node().nd == 2;
			elem.select('.open-menu')
				.classed('d1', !two_d_slide)
				.classed('d2', two_d_slide);
			elem.select('.open-spec-legend').call(spec.menu.spectra());
			elem.select('.open-slides').call(spec.menu.slides());
		});
		app_dispatcher.on('slideContentChange.menu', function () {
			elem.select('.open-spec-legend').call(spec.menu.spectra());
		});
		
		pro.read_menu(app.node(), spec.menu.menu_data); //read menu from server.
		return elem;									
	}
	return _main;
};

spec.menu.main_menu = function () {
	function add_li(sel) {
		sel.enter()
			.append("li")
			.text(function(d){return d.label;})
			.classed('menu-item', true)
			.classed('not1d', function(d){ return d.nd && d.nd.indexOf(1) < 0 })
			.classed('not2d', function(d){ return d.nd && d.nd.indexOf(2) < 0 });
    
		return sel;		
	}
	function recursive_add(sel){
 		var new_sel = sel.filter(function(d){return d.children;})
			.classed('openable', true)
			//.attr('tabindex', 1)
			.append("div").append("ul")
			.selectAll("li")
				.data(function(d){return d.children})
				.call(add_li);
		
		if(new_sel.filter(function(d){return d.children;}).size() > 0){
			recursive_add(new_sel);
		}
	}
	
	function _main(div) {
		div.select('.menu-container').remove();
		
		var nav = div.append(inp.popover('Menu'))
			.classed('menu-container', true)
			.select('.popover-content')
				.append('div')
				.classed('main-menu', true)
					.append("ul")
					.classed('nav',true);
		
		nav.selectAll("li")
			.data(spec.menu.menu_data)
			.call(add_li)
			.call(recursive_add);
			
    nav.selectAll('li')
      .on("click", function(d){
        if(d.fun){
          fireEvent(div.node(), 'click'); //close the menu.
          d.fun();
        }else{
        	this.focus();
        }
      });

	}
	return _main;
};
spec.menu.spectra = function () {
	function _main(div) {
		div.select('.menu-container').remove();
		
		var nav = div.append(inp.popover('Spectra'))
			.classed('menu-container', true)
			.select('.popover-content')
		
		var spec_list = d3.select(inp.spectrumSelector()())
			.select('ul');
		
		if(spec_list.size() === 0){
			nav.append(inp.spectrumSelector());
		}else{
			nav.append(function () {
				return spec_list.node();
			}).classed('block-list spec-list no-checkbox', true);
		}					
		
		return div;
	}
	return _main;
};
spec.menu.slides = function () {
	function _main(div) {
		var app = div.selectP('.spec-app');
		
		div.select('.menu-container').remove();
		
		var slides = app.selectAll('.spec-slide');
		
		var nav = div.append(inp.popover('Slides'))
			.classed('menu-container', true)
			.select('.popover-content')
		
		nav.append('ul')
			.classed('block-list slide-list', true)
			.selectAll('li')
			.data(slides[0]).enter()
			.append('li')
				.text(function(d,i){return 'Slide ' + (i+1);})
				.on('click', function (d) {
					slides.classed('active', false);
					d3.select(d).classed('active', true);
					app.node().dispatcher.slideChange();
				});
				
		return div;
	}
	return _main;
};


spec.menu.menu_data = 
[	
  {
		label:"Processing",
	},
  {
    label:"Analysis",
    children:[
      {
				label:"Peak Picking",
				children:[
					{label:"Manual peak picking",fun:events.peakpickToggle},
		  		{label:"View/manage peak table",fun:null},
					{label:"Delete peaks",fun:events.peakdelToggle},
				]
			},	
		]
  },
	{
		label:"View",
		children:[
			{
				label:"Change region",
				children:[
					{label:"Set X region",fun:modals.xRegion},
					{label:"Set Y region",fun:modals.yRegion},
					{label:"Full spectrum",fun:null,//dispatcher.regionfull,
						children:[{label:"Error",fun:function(){modals.error('error message')}},]
					},
					{label:"Reverse Spectrum",fun:null},
					{label:"Invert Phases",fun:null},
				]
			},
		],
	},
  {
		label:"Integration",
		fun:events.integrateToggle,
	},
  {label:"crosshair",fun:events.crosshairToggle},
  {label:"Selected",fun:function(){},
		children:[
			{label:"Scale",fun:modals.scaleLine},
		]
	},
	{
		label:"Export",
		children:[
			{label:"As PNG",fun:function(){
				setTimeout(function(){savePNG(svg.selectP("svg"), "specdraw.png")},500);
			}},
			{label:"As SVG",fun:function(){
				setTimeout(function(){saveSVG(svg.selectP("svg"), "specdraw.svg")},500);
			}},
			{label:"Search NMRShiftDB",fun:searchNMRShiftDB},
			{label:"CSV",fun: function(){}},
			{label:"Peak table",fun:function(){}},
			{label:"JCAMP-DX",fun:function(){}},
		],
	},
];

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
		
		var dispatch_idx = ++dispatcher.idx;
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
};
spec.d1.crosshair = function(){
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
		
		var tip = d3.tip()
		  .attr('class', 'crosshair tooltip')
			.direction('ne')
		  .offset([0, 0])
			.bootstrap(true);
			
		var i_scale = x.copy();
		var line_idx = svg.node().line_idx;
		
		svg_elem = svg.append("g")
			.attr("class", "crosshair")
			.datum(null).call(tip);

		svg_elem.append("circle")
			.attr("class", "clr"+ line_idx)
			.attr("r", 4.5)
			.on("click",function(){
				svg.toggleClass("selected");
			})
			.on("mouseenter",function(){
				svg.selectP('.main-focus').classed('dimmed', true);
				svg.classed('highlighted', true);
			})
			.on("mouseleave",function(){
				svg.selectP('.main-focus').classed('dimmed', false);
				svg.classed('highlighted', false);
			});

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
					
				tip.text(d3.round(data[i].x,3)).show(svg_elem.node());
				svg_elem.attr("i_pos", i);			
				svg_elem.datum(data[i]);				
				svg_elem.attr("transform", "translate(" + x(data[i].x) + "," + y(data[i].y) + ")");			
			});
		
		
		svg_elem.node().setData = function(_){data = _;}		
		svg_elem.node().dataSlice = function (_) {
			if (!arguments.length) return i_scale.domain();
			i_scale.domain(_);
		};
	
		svg_elem.node().show = function (_) {
			if (!arguments.length) return !(svg_elem.style("display")==="none");			
			svg_elem.style("display", _? null : "none");
			
			if(_) { tip.show(svg_elem); }
			else{tip.hide()}
			
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
		};
		svg_elem.node().remove = function () {
			dispatcher.on("regionchange.line."+dispatch_idx, null);
			dispatcher.on("mouseenter.line."+dispatch_idx, null);
			dispatcher.on("mouseleave.line."+dispatch_idx, null);
			dispatcher.on("mousemove.line."+dispatch_idx, null);	
			dispatcher.on("crosshairEnable.line."+dispatch_idx, null);
			data = null;
			svg_elem.remove();			
		};
		
		// Register event listeners
		var dispatch_idx = ++dispatcher.idx;
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
				var dispatch_idx = ++dispatcher.idx;
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
	var data, x, y, s_id, dispatcher, range={}, svg_elem, hasCrosshair = true;
	
	function _main(svg) {
		var _crosshair, dataResample, data_slice, segments = [], scale_factor = 1;
		
		var path = d3.svg.line()
			.interpolate('linear')
			.x(function(d) { return x(d.x); })
			.y(function(d) { return y(d.y * scale_factor); });
		
		var width = svg.attr("width")
		
		svg_elem = svg.append("g")
			.attr("class", "spec-line");
		svg_elem.attr("clip-path","url(#" + svg_elem.selectP('.spec-slide').node().clip_id + ")")
		
		svg_elem.node().range = range;
			
		var line_idx = svg.node().nSpecs;
		svg_elem.node().line_idx = line_idx;
		
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
				if(e.x){
					path_elem.attr("d", path)
						.attr("transform", 'scale(1,1)translate(0,0)');
					svg_elem.selectAll(".segment").attr("d", path);
				}else{ //change is in the Y axis only.
					var orignial_xscale = x.copy().domain(svg.node().range.x),
						orignial_yscale = y.copy().domain(svg.node().range.y);
					
					var translate_coor = [0,
		 				-Math.min(orignial_yscale(y.domain()[1]), orignial_yscale(y.domain()[0]) )];

					var	scale_coor = [ 1,
					  Math.abs((svg.node().range.y[0]-svg.node().range.y[1])/(y.domain()[0]-y.domain()[1]))];
				
					path_elem.attr("transform","scale("+scale_coor+")"+"translate("+ translate_coor +")");
					svg_elem.selectAll(".segment")
						.attr("transform","scale("+scale_coor+")"+"translate("+ translate_coor +")");
				}
			})
			.on("_regionchange", function(e){
				if(e.xdomain){
					var new_slice = sliceDataIdx(data, x.domain(), range.x);

					data_slice = new_slice;
					//TODO: resample factors both x and y dimensions.
					// Both dimension need to have the same unit, i.e. pixels.
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
		var dispatch_idx = ++dispatcher.idx;
		dispatcher.on("regionchange.line."+dispatch_idx, svg_elem.on("_regionchange"));
		dispatcher.on("redraw.line."+dispatch_idx, svg_elem.on("_redraw"));
		dispatcher.on("integrate.line."+dispatch_idx, svg_elem.on("_integrate"));
		
		svg_elem.node().specData = function () { return data;	};
		//TODO: Update peaks, integrate, segments to match new data.
		svg_elem.node().setData = function (_) {
			if(!_[0].x){ //if data is array, not xy format
				data = _.map(function(d,i){ return {x:data[i].x, y:d}; });
			}else{
				data = _;
			}
			range.y = d3.extent(data.map(function(d) { return d.y; }));
			if(_crosshair) _crosshair.node().setData(data);
			
			svg_elem.on("_regionchange")({xdomain:x.domain()});
			svg_elem.on("_redraw")({x:true});
		};
		svg_elem.node().dataSlice = function () { return data_slice;	};
		svg_elem.node().specRange = function () { return range;	};
		svg_elem.node().s_id = function (_) { 
			if (!arguments.length)
				return s_id; 
			s_id = _;
		};
		svg_elem.node().setScaleFactor = function (_) {
			if (!arguments.length) return scale_factor;
			scale_factor = _;
			svg_elem.on("_redraw")({y:true});
		};
		svg_elem.node().addPeaks = function (idx) { //TODO:assign color to peaks
			svg.select(".peaks").node().addpeaks(data.subset(idx), line_idx);			
			svg.select(".peaks").on("_regionchange")({xdomain:true});
			svg.select(".peaks").on("_redraw")({x:true});			
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
		svg_elem.node().remove = function () {
			dispatcher.on("regionchange.line."+dispatch_idx, null);
			dispatcher.on("redraw.line."+dispatch_idx, null);
			dispatcher.on("integrate.line."+dispatch_idx, null);
			data = null;
			if(hasCrosshair)
				_crosshair.node().remove();
			svg_elem.remove();
		};
		
		return svg_elem;									
	}
	
  _main.datum = function(_){
    if (!arguments.length) return data;
		if(!_[0].x){ //if data is array, not xy format
			var xscale = d3.scale.linear()
				.range(svg.node().range.x)
				.domain([0, _.length]);
			
			data = _.map(function(d,i){ return {x:xscale(i), y:d}; });
		}else{
    	data = _;
		}
		
		range.x = [data[0].x, data[data.length-1].x];
		range.y = d3.extent(data.map(function(d) { return d.y; }));
		
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
  _main.s_id = function(_){
    if (!arguments.length) return s_id;
    s_id = _;
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
				if(x && y) _brush.extent([[0,0],[0,0]]);
				else{ _brush.extent([0,0]); }
				
				svg_elem.call(_brush);
				return null;
    	}
			var e = {}
			if(x && y){
				e.xdomain = [_brush.extent()[1][0], _brush.extent()[0][0]];
				e.ydomain = [_brush.extent()[1][1], _brush.extent()[0][1]];				
			}else{
				e.xdomain = x? _brush.extent().reverse():null;
				e.ydomain = y? _brush.extent():null;
			}		
			
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
			.y(y)
	    .on("brushend", changeRegion);
		
		svg_elem = svg.append("g")
			.attr("class", "main-brush")
			.call(_brush);
				
		svg_elem.selectAll("rect")
			.attr("height", height);
		
		svg_elem.select(".background")
			.style('cursor', null)
			.style('pointer-events', 'all');
		
		svg.style("cursor", "crosshair");
		
		svg_elem.node().peakpickEnable = function (_) {
			svg_elem.classed("peakpick-brush", _);
			svg
				.style("cursor", _? 'url('+cursor.peakpick+'), auto' : "crosshair");
			
			_brush.on("brushend", _? peakpick : changeRegion);
		};
		svg_elem.node().peakdelEnable = function (_) {
			svg_elem.classed("peakdel-brush", _);
			svg
					.style("cursor", _? 'url('+cursor.peakdel+'), auto' : "crosshair");
			
			_brush.on("brushend", _? peakdel : changeRegion);
		};
		svg_elem.node().integrateEnable = function (_) {
			svg_elem.classed("integrate-brush", _);
			svg
					.style("cursor", _? 'url('+cursor.addinteg+'), auto' : "crosshair");
			
			_brush.on("brushend", _? integrate : changeRegion);
		};
	
		// Register event listeners
		var dispatch_idx = ++dispatcher.idx;		
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
				
				svg.select(".main-focus").on("_regionchange")( x ? {xdomain:extent}	: {ydomain:extent} );
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
		var dispatch_idx = ++dispatcher.idx;
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
		
		var _peaks = [], _peaks_vis = [], 
				cls = [], cls_vis = [];
		
		svg_elem = svg.append("g")
			.attr("class", "peaks")
		
		svg_elem
			.on("_click", function(e){
				if(!events.crosshair)
					d3.selectAll(".crosshair").each(function(){
						d3.select(this).on("_mousemove")(e);
					});
				
				// In case of manual peak picking on multiple spectra,
				// A only the highest peak is added. 
				/*var clicked_peaks = d3.selectAll(".crosshair").data()
					.sort(function(a,b){return d3.descending(a.y, b.y)});
				
				dispatcher.peakpick(clicked_peaks[0]);*/
				svg.selectAll(".crosshair").each(function(){
					svg_elem.node().addpeaks(this.__data__, this.parentNode.line_idx);
					svg_elem.on("_regionchange")({xdomain:true});
					svg_elem.on("_redraw")({x:true, y:true});
				});	
				
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
					.data(_peaks_vis);
				
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
					//.style("stroke", "black")
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
					.attr("class", function(d){return 'peak-text clr'+d[2];})
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
					.attr("class", function(d){return 'peak-line clr'+d[2];})
					.attr("d", function(d,i){return peakLine(d[0],d[1],labels_x[i])});
			})
			.on("_peakpick", function (e, line_idx) {
				this.addPeaks(e, line_idx)
				//_peaks_vis.push([e.x, e.y]);				
				svg_elem.on("_regionchange")({xdomain:true});
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
		var dispatch_idx = ++dispatcher.idx;
		dispatcher.on("regionchange.peaks."+dispatch_idx, svg_elem.on("_regionchange"));
		dispatcher.on("redraw.peaks."+dispatch_idx, svg_elem.on("_redraw"));		
		dispatcher.on("peakpickEnable.peaks."+dispatch_idx, function (_) {
				dispatcher.on("click.peaks."+dispatch_idx, 
					_? svg_elem.on("_click"): null);
		});
		
		dispatcher.on("peakpick.peaks."+dispatch_idx, svg_elem.on("_peakpick"));
		dispatcher.on("peakdel.peaks."+dispatch_idx, svg_elem.on("_peakdel"));
		
		svg_elem.node().peaks = function(){return _peaks;};
		svg_elem.node().addpeaks = function(_, line_idx){
			if(!_.x){
				for (var i = _.length - 1; i >= 0; i--) {
					this.addpeaks( _[i], line_idx );
				}
			}else{
				if(_peaks.indexOf([_.x, _.y]) == -1) //TODO:check if peak already exists.
					_peaks.push([_.x,_.y, line_idx]);
					//cls.push('clr'+line_idx);
			}
		};
		return svg_elem;						
	}
	
	function peakLine(line_x, line_y, label_x){
		var bottom = Math.max(y(line_y) - 10, 60);
		return d3.svg.line()
			.defined(function(d) { return !isNaN(d[1]); })
			([
			[label_x, 40], 
			[x(line_x), 60],
			[x(line_x), 80],
			[NaN, NaN],
			[x(line_x), bottom - 10],
			[x(line_x), bottom]
			]);
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
	/*var zoomTimer;
	var new_region;
	var stepzoom = function () {
		//console.log(new_region)
		if(new_region && (new_region[0] != range.y[0] || new_region[1] != range.y[1]))
			focus.on("_regionchange")(
				{zoom:true,	ydomain:new_region}
			);
		zoomTimer = setTimeout(stepzoom, 100);
	}*/
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
		focus.node().dispatch_idx =  0; // an index as a namespace for dispacther events.
		focus.node().nSpecs = 0;				// count how many spec-lines are displayed (used for coloring.)
		focus.node().xScale = x;
		focus.node().yScale = y;
		focus.node().range = range;
		focus.node().addPeaks = function (idx) { //TODO:move peaks to line
			focus.select(".peaks").node().addpeaks(data.subset(idx));			
			focus.select(".peaks").on("_regionchange")({xdomain:true});
			focus.select(".peaks").on("_redraw")({x:true});			
		};
		focus.node().addSpecLine = function(spec_data, crosshair, overwrite){
			if(!crosshair)
				crosshair = true;
			
		  
			var s_id = null;
			var spec_label = 'spec'+focus.node().nSpecs;
			console.log(spec_data['label'])
			if(!(spec_data.constructor === Array)){
				if(typeof spec_data["s_id"] != 'undefined') s_id = spec_data["s_id"];
				if(typeof spec_data['label'] != 'undefined') spec_label = spec_data["label"];
				spec_data = spec_data["data"]
			}
			
			var elem;
			//if(overwrite) console.log("overwrite size:", overwrite.size());
			
			if(!overwrite || overwrite.size() == 0){
				elem = spec.d1.line()
					.datum(spec_data)
					.xScale(x)
					.yScale(y)
					.s_id(s_id)
					.crosshair(crosshair)
					.dispatcher(dispatcher)
					(focus);
				
				elem.node().label = spec_label;
			}else{
				console.log("overwriting spec");
				elem = overwrite;
				elem.node().setData(spec_data);
				if(s_id) elem.node().s_id(s_id);
			}

			if(spec.globals.render){
				var x0 = d3.max(focus.selectAll(".spec-line")[0].map(function(s){return s.range.x[0]})),
					x1 = d3.min(focus.selectAll(".spec-line")[0].map(function(s){return s.range.x[1]})),
					y0 = d3.min(focus.selectAll(".spec-line")[0].map(function(s){return s.range.y[0]})),
					y1 = d3.max(focus.selectAll(".spec-line")[0].map(function(s){return s.range.y[1]}));
			
				var y_limits = (y1-y0);
				y0 = y0 - (0.05 * y_limits);
				y1 = y1 + (0.05 * y_limits);
				
				var xdomain = x.domain(), ydomain = y.domain();
			
				focus.on("_rangechange")({x:[x0,x1], y:[y0,y1], norender: focus.node().nSpecs > 0});
			
				if(focus.node().nSpecs > 0)
					focus.on("_regionchange")({xdomain:xdomain});				
			}
			
			focus.node().nSpecs++;
			return elem;
		}
		focus.node().addSpec = focus.node().addSpecLine;
		focus.node().nd = 1;
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
				if(e.x)
					range.x = e.x;
				if(e.y)
					range.y = e.y;
			
				dispatcher.rangechange(e);
				
				if(!e.norender)
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
		/*for (var i = 0; i < 3; i++) {
			pro.bl(function (data) {
				focus.node().addSpecLine(data).node().remove();
			}, {a:"cbf", prev:0});
		}*/
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
};
spec.d2 = {};

spec.d2.crosshair = function(){
	var svg_elem, x, y, dispatcher;
	
	function _main(svg) {		
		var tip = d3.tip()
		  .attr('class', 'crosshair tooltip')
			.direction('ne')
		  .offset([0, 0])
			.bootstrap(true);
		
		//var i_scale = x.copy();
		var line_idx = 0; //TODO: imp for datasets
		
		svg_elem = svg.append("g")
			.classed("crosshair clr" + line_idx, true)
			.datum(null).call(tip);

		var crosslines = svg_elem.append("g")
			.attr("class", "crosshair line");
		
		crosslines.append("path")
			.attr("class", "crosshair line x")
			.attr('d', d3.svg.line()(
				[[-x.range()[1], 0], [x.range()[1], 0]]
			));
		
		crosslines.append("path")
			.attr("class", "crosshair line y")
			.attr('d', d3.svg.line()(
				[[0, -y.range()[0]], [0, y.range()[0]]]
			));
		
		var cross_circle = svg_elem.append("circle")
			.attr("r", 4.5)

			/*			.on("click",function(){
							svg.toggleClass("selected");
						})
			*/ //TODO: select / highlight spectrum from dataset.

		svg_elem.append("text")
			.attr("x", 9)
			.attr("dy", "-1em");
			
		svg_elem
			.on("_regionchange", function(e){
					svg_elem.datum(null);
					svg_elem.attr("transform", "translate(" + (-10000) + "," + (-10000) + ")");
			})
			.on("_mousemove", function(e){
				var data_point = [x.invert(e.xcoor), y.invert(e.ycoor)]
					
				tip.text(
					d3.round(data_point[0],3) + ', ' + d3.round(data_point[1],3)
				).show(cross_circle.node());
				//d3.selectAll('.tooltip').style('pointer-events', 'none');
				
				svg_elem.datum(data_point);				
				svg_elem.attr("transform", "translate(" + e.xcoor + "," + e.ycoor + ")");
				/*svg_elem.select("text").text(
					d3.round(data_point[0],3) + ',' + d3.round(data_point[1],3)
				);*/				
			});
		
		
		svg_elem.node().show = function (_) {
			if (!arguments.length) return !(svg_elem.style("display")==="none");			
			svg_elem.style("display", _? null : "none");
			
			if(_) { tip.show(svg_elem); }
			else{tip.hide()}
			
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
		/*
		svg_elem.node().i = function (_) {
			if (!arguments.length) return svg_elem.attr("i_pos");
			svg_elem.attr("i_pos", i);
			svg_elem.datum(data[i]);
		};*/
		svg_elem.node().remove = function () {
			dispatcher.on("regionchange.line."+dispatch_idx, null);
			dispatcher.on("mouseenter.line."+dispatch_idx, null);
			dispatcher.on("mouseleave.line."+dispatch_idx, null);
			dispatcher.on("mousemove.line."+dispatch_idx, null);	
			dispatcher.on("crosshairEnable.line."+dispatch_idx, null);
			data = null;
			svg_elem.remove();			
		};
		
		// Register event listeners
		var dispatch_idx = ++dispatcher.idx;
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

spec.d2.main_focus = function () {
	var focus, width, height, x, y, dispatcher, data, range = {};
	var zoomer = d3.behavior.zoom()
		.on("zoom", function (){
			/*var factor = 0.3/Math.log(30);
			var val = Math.log(zoomer.scale())*factor;		
			d3.select("#rfunc").attr("slope",0.5+val);
			d3.select("#bfunc").attr("intercept",-0.5+val);*/
			d3.select("#rfunc").attr("slope", zoomer.scale());
			d3.select("#bfunc").attr("slope", zoomer.scale());
		}).scaleExtent([0.1,100]);	
	
	function _main(slide) {
		focus = slide.append("g")
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
		focus.node().addSpec = function(spec_data, crosshair, overwrite){
			if(arguments.length < 2)
				crosshair = true;
			
			var elem;
			if(overwrite) console.log("overwrite size:", overwrite.size());
			
			if(!overwrite || overwrite.size() == 0){
				elem = spec.d2.spec2d()
					.datum(spec_data["data"])
					.xScale(x)
					.yScale(y)
					.s_id(spec_data["s_id"])
					.range({x:spec_data["x_domain"], y:spec_data["y_domain"]})
					.crosshair(crosshair)
					.dispatcher(dispatcher)
					(focus);
			}else{
				console.log("overwriting spec");
				elem = overwrite;
				elem.node().setData(spec_data['data']);
				if(spec_data['s_id']) elem.node().s_id(spec_data['s_id']);
			}
			
			var xdomain = x.domain(), ydomain = y.domain();
			
			console.log("domains: ",spec_data["x_domain"], spec_data["y_domain"])
			focus.on("_rangechange")({x:spec_data["x_domain"], y:spec_data["y_domain"], norender: focus.node().nSpecs > 0});
			
			if(focus.node().nSpecs > 0)
				focus.on("_regionchange")({xdomain:xdomain, ydomain:ydomain});
			
			focus.node().nSpecs++;
			return elem;
		};
		focus.node().addSpecLine = focus.node().addSpec;
		focus.node().nd = 2;
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
				//dispatcher.regionchange({xdomain:e.xdomain});
							
				if(e.ydomain){
					y.domain(e.ydomain);					
				}
				
				dispatcher.regionchange({xdomain:e.xdomain, ydomain:y.domain()});
				focus.on("_redraw")({x:e.xdomain, y:true});
			})
			.on("_rangechange", function(e){
				if(e.x)
					range.x = e.x;
				if(e.y)
					range.y = e.y;
			
				dispatcher.rangechange(e);
				
				if(!e.norender)
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
			focus.on("_regionchange")({xdomain:range.x, ydomain:range.y});		
		});
			
		// overlay rectangle for mouse events to be dispatched.
		/*focus.append("rect")
			.attr("width", width)
			.attr("height", height)
			.style("fill", "none");
		*/
		
		focus.node().addSpec(data);
		//brushes
		focus.call(
			spec.d1.mainBrush()
				.xScale(x)
				.yScale(y)
				.dispatcher(dispatcher)
		);
    
		
		
		//peak picker	
		/*focus.call(
			spec.d1.pp()
				.xScale(x)
				.yScale(y)
				.dispatcher(dispatcher)
		);*/
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
};
spec.d2.spec2d = function () {
	var data, x, y, s_id, dispatcher, range={}, svg_elem, hasCrosshair = true;
	
	function _main(svg) {
		var _crosshair, segments = [], scale_factor = 1;
		
		var width = svg.attr("width"),
				height = svg.attr("height");
		
		svg_elem = svg.append("g")
			.attr("class", "spec-img");
		
		svg_elem.attr("clip-path","url(#" + svg_elem.selectP('.spec-slide').node().clip_id + ")");

		var img_elem = svg_elem.append("g")
			.attr("filter", "url(#2dColorFilter)")
			.append("svg:image")
			  .attr('width', width)
			  .attr('height', height)
			  .attr('xlink:href', "data:image/ png;base64," + data)
			  .attr("preserveAspectRatio", "none");	
				

		svg_elem.node().range = range;
		
		/*** TODO: 2D dataset vis *****
		
		var line_idx = d3.select(".main-focus").node().nSpecs;
		var path_elem = svg_elem.append("path")
      .datum(data)
			.attr("class", "line clr"+ line_idx)
		
		******************************/
		
		if(hasCrosshair)
			_crosshair = (spec.d2.crosshair() 
				.xScale(x)
				.yScale(y)
				.dispatcher(dispatcher)
			)(svg_elem);
		// TODO: 2D integration
		
		svg_elem
			.on("_redraw", function(e){				
				console.log("scale & range: ",x, range.x)
				var orignial_xscale = x.copy().domain(range.x),
					orignial_yscale = y.copy().domain(range.y);
			
				//zooming on 2d picture by first translating, then scaling.
				var translate_coor = [-Math.min(orignial_xscale(x.domain()[1]), orignial_xscale(x.domain()[0])),
					 				-Math.min(orignial_yscale(y.domain()[1]), orignial_yscale(y.domain()[0]) )];
		
				var	scale_coor = [ Math.abs((range.x[0]-range.x[1])/(x.domain()[0]-x.domain()[1])),
								   Math.abs((range.y[0]-range.y[1])/(y.domain()[0]-y.domain()[1]))];

				img_elem.attr("transform","scale("+scale_coor+")"+"translate("+ translate_coor +")");
			})
			.on("_regionchange", function(e){				
			})
			.on("_integrate", function(e){
			})
			.on("_segment", function (e) {
			});
		
		// Register event listeners
		var dispatch_idx = ++dispatcher.idx;
		dispatcher.on("regionchange.line."+dispatch_idx, svg_elem.on("_regionchange"));
		dispatcher.on("redraw.line."+dispatch_idx, svg_elem.on("_redraw"));
		//dispatcher.on("integrate.line."+dispatch_idx, svg_elem.on("_integrate"));
		
		svg_elem.node().specData = function () { return data;	};
		svg_elem.node().setData = function (_) {
			data = _;
			img_elem.attr('xlink:href', "data:image/ png;base64," + data)
			svg_elem.on("_redraw")();
		};
		svg_elem.node().specRange = function () { return range;	};
		svg_elem.node().s_id = function () { return s_id;	};
		
		svg_elem.node().remove = function () {
			dispatcher.on("regionchange.line."+dispatch_idx, null);
			dispatcher.on("redraw.line."+dispatch_idx, null);
			//dispatcher.on("integrate.line."+dispatch_idx, null);
			data = null;
			/*if(hasCrosshair)
				_crosshair.node().remove();*/
			svg_elem.remove();
		};
		
		return svg_elem;									
	}
	
  _main.datum = function(_){
    if (!arguments.length) return data;		
		data = _;
		return _main;
  };
  _main.range = function(_){
    if (!arguments.length) return range;		
		range = _;
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
  _main.s_id = function(_){
    if (!arguments.length) return s_id;
    s_id = _;
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

/*
	import 'event';
	import 'menu';
	import 'slide';
*/
spec.app = function(){
  var slides = [], elem, svg_width, svg_height;

  function _main(div){
    /* * Check size definitions**/
		if (typeof svg_width === 'undefined' || typeof svg_height === 'undefined'
			|| isNaN(svg_width) || isNaN(svg_height)){
				var parent_svg = div.node();
				var dimensions = parent_svg.clientWidth ? [parent_svg.clientWidth, parent_svg.clientHeight]
					: [parent_svg.getBoundingClientRect().width, parent_svg.getBoundingClientRect().height];
				
				svg_width = dimensions[0] - 50; //deduct 50px for column menu.
				svg_height = dimensions[1];
		};
		
    if (svg_width < 400 || svg_height < 400){
      throw new Error("SpecApp: Canvas size too small. Width and height must be at least 400px");
    }
		
		
		var app_dispatcher = d3.dispatch('slideChange', 'slideContentChange', 'menuUpdate');
		
		elem = div.append('div')
			.classed('spec-app', true)
			.attr({
				width:svg_width,
				height:svg_height				
			});
		
		elem.node().dispatcher = app_dispatcher;
		
		// TODO: decide whether to inject CSS styles.
		//applyCSS2();
		
		elem.call(spec.menu());
		/*var svg_elem = elem.append('svg')
			.attr({
				width:svg_width,
				height:svg_height				
			}).append('g');
		*/
		//elem.call(spec.slideChanger());
		/**** Keyboard events and logger ****/
		registerKeyboard(elem.node());
		
		elem.node().appendSlide = function (data) {
			elem.selectAll('.spec-slide').classed('active', false);
			elem.call(
				spec.slide()
					.datum(data)
					.width(svg_width)
					.height(svg_height)
			);
			app_dispatcher.slideChange();
			//elem.call(spec.slideChanger());
		};
		elem.node().appendToCurrentSlide = function (data) {
			var current_slide = elem.select('.spec-slide.active').node();
			if(!current_slide){
				elem.node().appendSlide(data);
			}	else{
				current_slide.addSpec(data);
				app_dispatcher.slideContentChange();
			}
		};
		
		elem.node().options = _main.options;
		app_dispatcher.on('slideChange.app', function () {
			elem.node().slideDispatcher = elem.select('.spec-slide.active').node().slideDispatcher;
		});
		
		for (var i = 0; i < slides.length; i++) {
			elem.node().appendSlide(slides[i].slide);
		}		
	}
	
	_main.appendSlide = function(data){
		if (!arguments.length) 
			throw new Error("appendSlide: No data provided.");
		
		if (elem){
			elem.node().appendSlide(data);
		} else{
			slides.push({'slide':data});
		}
		return _main;
	};
	_main.appendToCurrentSlide = function(data){
		if (!arguments.length) 
			throw new Error("appendToCurrentSlide: No data provided.");
		
		if (elem){
			elem.node().appendToCurrentSlide(data);
		} else{
			if(slides.length === 0) //No slides available; create a new one
				return _main.appendSlide(data);
			
			//Otherwise, append data to last slide.
			var current_slide = slides[slides.length-1].slide;
			//TODO: BUG
			//We don't know if the array in slide is a data array 
			// or an array of data arrays (i.e dataset)
			current_slide.push(data);
			
			return _main;
		}
	};
	
  _main.width = function(x){
    if (!arguments.length) return svg_width;
    svg_width = x;
    return _main;
  };

  _main.height = function(x){
    if (!arguments.length) return svg_height;
    svg_height = x;
    return _main;
  };
	_main.options = {
		grid:{x:false, y:false}
	};
	return _main;
};

/*
	import 'event';
	import 'd1/main-focus';
	import 'd2/main-focus';
	import 'd1/scale-brush';
*/
spec.slide = function(){
	var data, elem, svg_width, svg_height;
	function _main(app){
		if(!data){
			create_empty_slide();//TODO
			return ;
		}
		
		var brush_margin = 20;

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
          .tickFormat(d3.format("s"));
		
    var xGrid = d3.svg.axis().scale(x)
					.orient("bottom").innerTickSize(height)
					.tickFormat(''),
        yGrid = d3.svg.axis().scale(y)
					.orient("right").innerTickSize(width)
					.tickFormat('');
  	
		var two_d = (data["nd"] && data["nd"] === 2);
		
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
		dispatcher.idx = 0;
		
		var spec_slide = app.append("svg")
			.attr({
				width:svg_width,
				height:svg_height				
			}).classed("spec-slide", true)
			.classed("active", true)
		
		var contents = spec_slide.append('g')
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		
		spec_slide.node().clip_id = guid();
    var defs = spec_slide.append("defs");
		defs.append("clipPath")
		.attr("id", spec_slide.node().clip_id)
		  .append("rect")
		    .attr("width", width)
		    .attr("height", height);

		/** PNG images are grey scale. All positive and negative values are represented as unsined 8-bit int.
				where 127 represent the zero. We want to recolor them as follows:
			 	* positive values colored with a red-orange hue.
				* negative values colored with a blue-cyan hue.
				* Zeros colored as white.
			* To do so, first copy Red component to Green and Blue.
			* Red component will take zeros upto 255/2 (127) i.e negative values. values >127 colored using red/green gradient.
			* constrast this for the blue component.
		*/
	
		if(two_d){
			var svg_filter = defs.append("filter").attr("id", "2dColorFilter");
			svg_filter.append("feColorMatrix")
				.attr("type","matrix")
				.attr("values","1 0 0 0 0	0 0 0 0 0 1 0 0 0 0 0 0 0 1 0");
	
			var fe_component_transfer = svg_filter.append("feComponentTransfer")
											.attr("color-interpolation-filters","sRGB");
	
			fe_component_transfer.append("feFuncR")
									.attr("type","linear")
									.attr("slope","-1")
									.attr("intercept","0.5");
							
			fe_component_transfer.append("feFuncB")
									.attr("type","linear")
									.attr("slope","1")
									.attr("intercept","-0.5");
	
			var fe_component_transfer = svg_filter.append("feComponentTransfer")
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
		
		//axes	and their labels
		contents.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")");
			

		contents.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + width + ",0)");;
		
		contents.append("g").classed('x grid', true);
		contents.append("g").classed('y grid', true);
		
		contents.append("text")
	    .attr("class", "x label")
	    .attr("text-anchor", "middle")
	    .attr("x", width/2)
	    .attr("y", height)
			.attr("dy", "2.8em")
	    .text("Chemical shift (ppm)");
		
		contents.append("text")
	    .attr("class", "y label")
	    .attr("text-anchor", "end")
	    .attr("y", width)
	    .attr("dy", "-.75em")
	    .attr("transform", "rotate(-90)")
	    .text("Intensity");
		
		dispatcher.on("redraw.slide", function (e) {
			if(e.x){
				contents.select(".x.axis").call(xAxis);
				if(app.node().options.grid.x)
					contents.select(".x.grid").call(xGrid);
			}
			if(e.y){
				contents.select(".y.axis").call(yAxis);
				if(app.node().options.grid.y)
					contents.select(".y.grid").call(yGrid);
				
			}
		});
		
		var main_focus = two_d ? spec.d2.main_focus : spec.d1.main_focus
		//Main focus
		contents.call(
			main_focus()
				.datum(data)
				.xScale(x)
				.yScale(y)
				.width(width)
				.height(height)
				.dispatcher(dispatcher)
		);
		
		//Scale brushes
		contents.call(
			spec.d1.scaleBrush()
				.xScale(x)
				.dispatcher(dispatcher)
		);
	
		contents.call(
			spec.d1.scaleBrush()
				.yScale(y)
				.dispatcher(dispatcher)
		);
		
		spec_slide.node().nd = two_d ? 2 : 1;
		spec_slide.node().addSpec = function (_) {
			contents.select('.main-focus').node().addSpec(_);
		};
		spec_slide.node().slideDispatcher = dispatcher;
	}
	
  _main.datum = function(_){
    if (!arguments.length) return data;
    data = _;
    return _main;
  };
  _main.width = function(x){
    if (!arguments.length) return svg_width;
    svg_width = x;
    return _main;
  };

  _main.height = function(x){
    if (!arguments.length) return svg_height;
    svg_height = x;
    return _main;
  };
	return _main;
};

spec.slideChanger = function () {
	function _main (svg) {
		var inner;
		if(svg.select('.slide-changer').size() === 0){
			var elem = svg.append("g")
				.attr("class", "slide-changer");
		
			var width = svg.attr("width"),
					height = svg.attr("height");
		
			var slideout = elem.append("svg:foreignObject")
				.attr("width", width)
				.attr("height", height)
				.style('pointer-events', 'all')
				.append("xhtml:div")
				.classed("slideout", true)
				.on('click', function () {
					slideout.toggleClass('active');
				})
		
			slideout.append('xhtml:p').text('Slides');
			inner = slideout.append('xhtml:div')
				.classed('slideout_inner', true)
				.text('Switch Slide');			
		}else{
			inner = svg.select('.slideout_inner');
		}
		
		var slides = svg.selectAll('.spec-slide');
		/*slides.each(function (d,i) {
			var this_slide = this;
			inner.append('xhtml:div').text('slide ' + i)
				.on('click', function () {
					slides.classed('active', false);
					d3.select(this_slide).classed('active', true);
					console.log(this_slide)
					svg.node().dispatcher = this_slide.slideDispatcher;
				});
		});*/
		
		inner.selectAll('div')
			.data(slides[0]).enter()
			.append('xhtml:div')
				.text(function(d,i){return 'slide ' + (i+1);})
			
		inner.selectAll('div')
			.on('click', function (d) {
				slides.classed('active', false);
				d3.select(d).classed('active', true);
				svg.node().dispatcher = d.slideDispatcher;
			});
	}
	
	return _main;
};

var ajax = function (url, callback, err) {
	var http_request = new XMLHttpRequest();
	http_request.open("GET", url, true);
	http_request.onreadystatechange = function () {
	  var done = 4;
	  var ok = 200;
	  if (http_request.readyState === done && http_request.status === ok){
			if(typeof(callback) === 'function')
				callback(http_request.responseText);
		}else	if (http_request.readyState === done){
			err(http_request.responseText)
		}
	};
	http_request.send();	
};
var ajaxJSONGet = function(url, callback, show_progress){
	var prog = ajaxProgress();
	ajax(url, function (response) {
		prog.stop();
		var json = JSON.parse(response);
		if(typeof json['error'] === 'undefined'){
		  callback(json);
		}else{
			modals.error(json['error']['name'], json['error']['message']);
		}

	},
	function (err) {
		prog.stop();
		modals.error('Network Error', err);
	});
	
	if(show_progress)
		prog();
};

var ajaxProgress = function () {
	var interval, stopped=false;
	function check () {
		ajax('/nmr/test', function (response) {
			if(!stopped){
				d3.select(".progress").text(response);
				setTimeout(check, 100);
			}else{
				ajax('/nmr/test?complete=1')
			}
		});
	}
	
	var run = function() {
		check();
	}
	
	run.stop = function() {
		clearInterval(interval);
		stopped = true;
	  d3.select(".progress").text("Completed")
			/*.transition()
	    .duration(2500)
	    .style("opacity", 1e-6)*/
	}
	return run;
}

var make_png_worker = function () {
	var png_worker = function () {
		function scale(range, domain){
			var domain_limits = domain[1] - domain[0];
			var range_limits = range[1] - range[0];
		
			return function(_){
				return ((_ - domain[0]) / domain_limits) * range_limits + range[0];
			};
		}
	
		self.onmessage = function(e, buf){
			e = e.data;
			var buffer = e.buffer;
			var len = e._16bit? buffer.length/2: buffer.length;
		
			var yscale = scale(e.y_range, e.y_domain);
			var img_data = new Float64Array(len/4);
		
			for (var i = 0; i < len; i+=4) {
				if(! e._16bit){
					img_data[i/4] = yscale(buffer[i]);
				}else{
					img_data[i/4] = yscale( (buffer[ i + len ] << 8) + buffer[i] );
				}
			}
			self.postMessage(img_data, [img_data.buffer]);
		};	
	};
	var blob = new Blob(['('+ png_worker.toString() +')()'],
		{ type: 'application/javascript' });
	var blobURL = window.URL.createObjectURL(blob);
	var worker = new Worker(blobURL);	
	return worker;
}

pro.worker = make_png_worker();
pro.worker_queue = function (worker) {
	var q = [], job;
	var init = {};
	init.next = function () {
		job = q.shift();
		if (!job) // if the queue is finished.
			return;
		
		worker.onmessage = function (e) {
			var callback = job['callback'];
			init.next();
			callback(e);
		};
		worker.postMessage(job['message'][0], job['message'][1]);
	};
	init.addJob = function (_) {
		q.push(_);
		if (!job) //if not job is currently excuting, do this job.
			init.next();
	};
	return init;
};
pro.worker.queue = pro.worker_queue(pro.worker);
var get_png_data = function(y, callback){
	var img = document.createElement("img");
	
	img.onload = function(){
	    var canvas = document.createElement("canvas");
	    canvas.width = img.width;
	    canvas.height = img.height;

	    // Copy the image contents to the canvas
	    var ctx = canvas.getContext("2d");

	    ctx.drawImage(img, 0, 0);    
	    var buffer = ctx.getImageData(0,0,img.width,img.height).data;
		
	    var img_data = Array.prototype.filter.call(buffer, function(element, index){
	        return(index%4==0);
	    });
		
		callback(img_data)
	}
	
	img.src = "data:image/png;base64," + y;	
};

var process_xy = function(pre_data, render_fun){
	var data = pre_data.x.map(function(d,i){ return {x:d, y:pre_data.y[i]}; });	
	render_fun(data);
};

var process_png = function(pre_data, render_fun){
	if (pre_data['nd'] == 1){
		get_png_data(pre_data['y'], function(img_data){
			// Scaling X and Y
			var xscale = d3.scale.linear().range(pre_data['x_domain']).domain([0, img_data.length]);
			var yscale = d3.scale.linear().range(pre_data['y_domain']).domain([0, 255]);
		
			// Mapping data and rendering
			var data = img_data.map(function(d,i){ return {x:xscale(i), y:yscale(d)}; });
			render_fun(data);	
		});
	}
	
	if (pre_data['nd'] == 2){
		// Mapping data and rendering
		render_fun(pre_data);
	}
};


var process_b64 = function(pre_data, render_fun){
	var img_data = atob(pre_data['y'])
	console.log(img_data);
	// Scaling X and Y
	var xscale = d3.scale.linear().range(pre_data['x_domain']).domain([0, img_data.length]);
	var yscale = d3.scale.linear().range(pre_data['y_domain']).domain([0, 255]);

	// Mapping data and rendering
	var data = img_data.map(function(d,i){ return {x:xscale(i), y:yscale(d)}; });
	render_fun(data);	
};


var processPNG = function (json, callback) {
	if (!json['nd'] || json['nd'] == 1){
		var img = document.createElement("img");
	
		img.onload = function(){
	    var canvas = document.createElement("canvas");
	    canvas.width = img.width;
	    canvas.height = img.height;

	    // Copy the image contents to the canvas
	    var ctx = canvas.getContext("2d");

	    ctx.drawImage(img, 0, 0);    
	    var buffer = ctx.getImageData(0,0,img.width,img.height).data;
	
	    var img_data = [];
			var _16bit = (json['format'] == "png16")
			var len = _16bit? buffer.length/2: buffer.length;
			
			var yscale = d3.scale.linear().range(json['y_domain']).domain([0, 255]);
			if(_16bit) yscale.domain([0,Math.pow(2,16)-1]);
			
			for (var i = 0; i < len; i+=4) {
				if(!_16bit){
					img_data.push(yscale(buffer[i]))
				}else{
					img_data.push( yscale( (buffer[ i + len ] << 8) + buffer[i]) );
				}
			}
			
			if(json['x_domain']){
				var xscale = d3.scale.linear().range(json['x_domain']).domain([0, img_data.length]);
				img_data = img_data.map(function(d,i){ return {x:xscale(i), y:d}; });
			}
			
			//console.log("img_data",img_data);
			var ret;
			if(typeof json["s_id"] != 'undefined')
				ret = {data:img_data, s_id:json['s_id']}
			else{ ret = {data:img_data} }
			
			callback(ret)
		}
		var png_data = json['data']? json['data']: json['y'];
		img.src = "data:image/png;base64," + png_data;
	}else if (json['nd'] == 2){
		// Mapping data and rendering
		callback(json);
	}else{
		console.log("Unsupported data dimension: "+ json['nd'])
	}
};

var processPNGworker = function (json, callback) {
	if (!json['nd'] || json['nd'] == 1){
		var img = document.createElement("img");
	
		img.onload = function(){
	    var canvas = document.createElement("canvas");
	    canvas.width = img.width;
	    canvas.height = img.height;

	    
	    
	
			var e = {};
			e._16bit = (json['format'] == "png16")
			
	    // Copy the image contents to the canvas
	    var ctx = canvas.getContext("2d");
	    ctx.drawImage(img, 0, 0);    
			e.buffer = ctx.getImageData(0,0,img.width,img.height).data;
			
			e.y_range = json['y_domain']
			e.y_domain = [0, 255];
			if(e._16bit) e.y_domain = [0,Math.pow(2,16)-1];
			
			var worker_callback = function(e) {
				console.log('worker done')
				var img_data = [].slice.call(e.data);
				
				if(json['x_domain']){
					var xscale = d3.scale.linear().range(json['x_domain']).domain([0, img_data.length]);
					img_data = img_data.map(function(d,i){ return {x:xscale(i), y:d}; });
				}
			
				/*var ret;
				if(typeof json["s_id"] != 'undefined')
					ret = {data:img_data, s_id:json['s_id']}
				else{ ret = {data:img_data}; }
				
				callback(ret);*/
				json['data'] = img_data;
				callback(json)
			};
			
			var worker_message = [e, [e.buffer.buffer]];
			pro.worker.queue.addJob({message:worker_message, callback:worker_callback});
		}
		var png_data = json['data']? json['data']: json['y'];
		img.src = "data:image/png;base64," + png_data;
	}else if (json['nd'] == 2){
		// Mapping data and rendering
		callback(json);
	}else{
		console.log("Unsupported data dimension: "+ json['nd'])
	}
};



/* * get the sepctrum from the web service in one these formats:
	* Plain JSON X-Y ['xy']
	* JSON X(range), Y (base64) ['base64'] --> if scaled down to 8 or 16 bits: require "y_domain"
	* JSON X(range), Y(png) ['png']--> require "y_domain"

  ** JSON object will contain the following parameters:
	* format: xy, base64, png
	* nd: number of dimensions (1 or 2)
	* x or x_domain: the chemical shift (x) value for each point, or chemical shift range (x_doamin)
	* y: singal intensities along the sepctrum.
	* y_domain: if 'y' was reduced to 8 or 16 bit, y_domain scales it back to original values.
*/

pro.get_spec = function(url, render_fun){
	ajaxJSONGet(url, function(pre_data){
		switch (pre_data['format']){
			case 'xy':
				process_xy(pre_data, render_fun);
				break;
			case 'base64'://add base64 processing
				process_b64(pre_data, render_fun)
				break;
			case 'png':
				process_png(pre_data, render_fun);
				break;
		}
	});	
};

pro.process_spectrum = function(json, render_fun){
	console.log('processing')
	if (json.constructor === Array) {
		for (var i = json.length - 1; i >= 0; i--) {
			pro.process_spectrum(json[i], render_fun);
		}
		return;
	}
	switch (json['format']){
		case 'xy':
			process_xy(json, render_fun);
			break;
		case 'base64'://add base64 processing
			process_b64(json, render_fun)
			break;
		case 'png':
		case 'png16':
			//pro.worker(json, render_fun);
			processPNGworker(json, render_fun);
			break;
	}	
};

pro.get_spectrum = function (url, render_fun) {
	ajaxJSONGet(url, function (response) {
		pro.process_spectrum(response, render_fun);
	});
};

pro.read_menu = function (app, menu_data) {
	var plugins = pro.plugins(app);
	var modals = spec.modals;
	//var plugins = require('./pro/plugins');
	//var modals = require('./modals');
	
	var find_menu_item = function (menu, item) {
		console.log(menu, item)
		for (var i = menu.length - 1; i >= 0; i--) {
			if(menu[i].label == item){
				if(!menu[i].children) menu[i].children = [];
				return menu[i];
			}
		}
		menu.push({label:item, children:[]});
		return menu[menu.length-1];
	};
	var plugin_functor = function (c) {
		if(c["args"]){
			return function() {
				modals.methods(c["fun"], c["args"], c["title"])();
			};
		}else{
			return function () { plugins.request (c["fun"]) };
		}
	};
	
	ajaxJSONGet('/nmr/test', function (response) {
		console.log(menu_data)
		var c = response;
		for (var i = 0; i < response.length; i++) {
			var path = find_menu_item(menu_data, c[i]['menu_path'][0]);
	
			for (var j = 1; j < c[i]['menu_path'].length; j++) {
				path = find_menu_item(path.children, c[i]['menu_path'][j]);
			}
			path.children = null;
			path.fun = plugin_functor(c[i]);
			path.nd = c[i]['nd'];			
	
		}		
		console.log(menu_data)
		app.dispatcher.menuUpdate();

	});
};



pro.output = {};
pro.output.overwriteSpec = function (new_data, s_id) {
	if(typeof s_id === 'undefined' && 
		typeof new_data['s_id'] !== 'undefined'){
		s_id = new_data['s_id'];
	}
	
	var _main_focus = d3.select(".spec-slide.active").select(".main-focus");
	
	var classname = _main_focus.node().nd == 1 ? ".spec-line" : ".spec-img";
	var overwrite_spec = _main_focus.selectAll(classname)
	.filter(function(e){ return this.s_id()==s_id; });
	
	_main_focus.node().addSpecLine(new_data, true, overwrite_spec);
};
pro.output.preview = function (new_data) {
	if(d3.select(".preview-spec").size() > 0){
		d3.select(".preview-spec").node().setData(new_data);
	}else{
		d3.select(".spec-slide.active").select(".main-focus").node()
			.addSpecLine(new_data, false)
			.classed("preview-spec", true);		
	}
};
pro.output.newSpec = function (new_data) {
	d3.select(".spec-slide.active").select(".main-focus").node().addSpecLine(new_data);
};
pro.output.newSlide = function (new_data) {
	
};

pro.analysis = {};
pro.analysis.addPeaks = function (json) {
	var s_id = json['s_id'];
	var _main_focus = d3.select(".spec-slide.active").select(".main-focus");
	var classname = _main_focus.node().nd == 1 ? ".spec-line" : ".spec-img";
	var spec = _main_focus.selectAll(classname)
		.filter(function(e){ return this.s_id() === s_id; });
	
	console.log(spec);
	if (spec.size() != 1){
		modals.error('Incompatible server response', 
		'Can\'t find spectrum with s_id:'+s_id)
	}
	spec.node().addPeaks(json['peaks']);		
};
pro.analysis.addSegments = function (json) {
	var s_id = json['s_id'];
	var _main_focus = d3.select(".spec-slide.active").select(".main-focus");
	var classname = _main_focus.node().nd == 1 ? ".spec-line" : ".spec-img";
	var spec = _main_focus.selectAll(classname)
		.filter(function(e){ return this.s_id() === s_id; });
	
	if (spec.size() != 1) {
		modals.error('Incompatible server response', 
		'Can\'t find spectrum with s_id:'+s_id)
	}
	
	spec.node().addSegmentByIndex(json['segs']);
};

pro.plugins = function (app) {
	var out = {};
	var get_selected_spec = function () {
		var _main_focus = d3.select(app).select(".spec-slide.active").select(".main-focus");
		var classname = _main_focus.node().nd == 1 ? ".spec-line" : ".spec-img"
	
		var s_id = _main_focus.selectAll(classname+".selected")[0].map(function(d){return d.s_id();});
		if(s_id.length == 0)
			s_id = _main_focus.selectAll(classname)[0].map(function(d){return d.s_id();});
	
		return s_id;
	};
	
	var handle_spectrum = function(json, preview){
		var output_fun = json["output"]? pro.output[ json["output"] ]: pro.output.overwriteSpec;
		pro.process_spectrum(json, output_fun);
		return;
	};

	var handle_spec_feature = function(json, preview){
		if (json['peaks'] !== undefined){
			pro.analysis.addPeaks(json);
		}
		if (json['segs'] !== undefined){
			pro.analysis.addSegments(json);
		}
	};
	
	out.request = function (fun, params, s_id, preview) {
		if(!params) params = {};
	
		if(!params['sid']){
			if(s_id){
				params['sid'] = s_id;
			}else{
				params['sid'] = get_selected_spec();
			}
		}
		if(params['sid'].length === 0)
			error('No Spectra selected', 'Please select one or more spectra!');
		
		var prefix = fun+'_';
		var params_str = 'sid=' + 
			JSON.stringify(params['sid']) + '&preview=' + (+preview) +'&'+ prefix + '=null';
	
		for(var key in params){
			if(key === 'sid') continue;
			if(params_str.length>0) params_str +='&';
		
			params_str += prefix + key+'='+params[key];
		}
	
		var url = '/nmr/plugins?'+params_str;
		ajaxJSONGet(url, function (response) {
				out.response(response, preview);
		});
	};
	
	out.response = function (json, preview) {
		if (json.constructor === Array) {
			for (var i = json.length - 1; i >= 0; i--) {
				out.response(json[i]);
			}
			return;
		}
		if (json['data_type'] === undefined || json['data_type'] === 'spectrum'){
			return handle_spectrum(json, preview);
		}
		if(json['data_type'] === 'spec_feature'){
			handle_spec_feature(json, preview);
			return;
		}
		if(json['data_type'] === 'spec_like'){
			handle_spec_like(json, preview);
			return;
		}
	};	
	return out;
};

  window.spec = spec;
	window.pro = pro;
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

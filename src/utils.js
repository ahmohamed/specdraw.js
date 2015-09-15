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
Array.prototype.whichMax = function () {
	if (!this.length || this.length === 0)
		return null;
		
	if (this.length === 1)
		return 0;
	
  var max = this[0].y;
  var maxIndex = 0;
  
  for (var i = 1; i < this.length; i++) {
    if (this[i].y > max) {
      maxIndex = i;
      max = this[i].y;
    }
  }
  return maxIndex;
};
Array.prototype.cumsum = function () {
	for (var _cumsum = [this[0]], i = 0, l = this.length-1; i<l; i++) 
	    _cumsum[i+1] = _cumsum[i] + this[i+1];
	
	return _cumsum;
};
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
  var dataResample = require('simplify')(data, (domain[0] - domain[1])/npoints);
	return dataResample;
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

module.exports.fireEvent = fireEvent;
module.exports.fullScreen = {};
module.exports.fullScreen.launch = launchFullScreen;
module.exports.fullScreen.toggle = toggleFullScreen;
module.exports.fullScreen.isFull = isFullScreen;
module.exports.guid = guid;
module.exports.simplify = resample;
module.exports.sliceData = getSlicedData;
module.exports.sliceDataIdx = sliceDataIdx;

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
var prev_bl = function(data){
	if(d3.select(".baseline").size() > 0){
		d3.select(".baseline").node().remove();
		d3.select(".main-focus").node().nSpecs--;
	}
		
	
	d3.select(".main-focus").node()
		.addSpecLine(data, false)
		.classed("baseline", true);
}


var clr_space = ["#5e94e5", "#26aa0e", "#fd5f11", "#fe25fb", "#a6906a", "#f75a93", "#02a783", "#b974f3", "#969904", "#b684a5", "#e07559", "#6a9baa", "#cd8313", "#fd45c6", "#69a24d", "#d46fbf", "#769c7d", "#a584d2", "#d77786", "#af9039", "#fb5d67", "#0f9ed1", "#04aa53", "#e258ed", "#8587f9", "#6ca313", "#8692be", "#0ca4a3", "#9f9091", "#bf8578", "#e4742d", "#c8844a", "#8a9a5c", "#fa6046", "#df6d9f", "#ef5cb3", "#fe37e0", "#d46ad9", "#859d36", "#5aa26f", "#4aa734", "#4b92ff", "#ed6780", "#c07db8", "#bc79d9", "#b88d0d", "#839891", "#26a868", "#0ca2b7", "#5c9f97", "#a388be", "#a0944f", "#ce7f65", "#6097d1", "#878ed2", "#878be5", "#b68c57", "#e66e6d", "#ca7b9f", "#d87b43", "#c869fa", "#8f9777", "#fd587a", "#8f93a4", "#eb5acc", "#c68632", "#b4888b", "#57a183", "#f045f4", "#0e98f9", "#a87eec", "#01aa3c", "#dc7a03", "#a7931a", "#619abe", "#a08cab", "#f7652f", "#fe4ab3", "#289ae5", "#67a335", "#4ca64c", "#ef6d0c", "#9e9638", "#829e15", "#51a710", "#a68f7e", "#c5808b", "#ec6d45", "#ee6a5a", "#f04fda", "#be8764", "#8f9947", "#779e69", "#d67972", "#29a590", "#d075ac", "#fe4fa0", "#d57e2b", "#e25ce0", "#4ca562", "#759f5b", "#c677c5", "#dd68c6", "#259fc4", "#ef60a0", "#e0708c", "#ef638d", "#959663", "#bf7fab", "#ca6ced", "#fe5c54", "#7b9e46", "#c572df", "#47a0aa", "#a67cf9", "#a98b98", "#7f95b1", "#979384", "#829984", "#6c90ec", "#e16aac", "#84969e", "#519db7", "#ce7d7f", "#44a47c", "#b381c5", "#c2881e", "#699f76", "#6b9c9d", "#379bd8", "#b68a71", "#a3925d", "#e154fa", "#cf813b", "#f46274", "#d27e51", "#849a70", "#93992e", "#9f83e5", "#b98b41", "#78a02d", "#f552c0", "#df7379", "#ff5387", "#d77499", "#31a92a", "#fe2fed", "#fe3fd3", "#35a844", "#f04ae7", "#6e93d8", "#e3743d", "#b18f27", "#ad9048", "#43a296", "#35a75a", "#b483b8", "#cf70cc", "#de7566", "#918ec5", "#b37fd2", "#6f96c4", "#928ad8", "#f16667", "#c18757", "#c18198", "#6f9d8a", "#b38c64", "#b28a7e", "#29a775", "#ce7b92", "#929491", "#9c9377", "#b58698", "#718df9", "#cc7f72", "#64a25b", "#7b92cb", "#509acb", "#998db8", "#9b89cb", "#e267b9", "#e67407", "#8f91b1", "#aa88b1", "#e1754b", "#9682f9", "#ee6d25", "#bb8b31", "#ed6d36", "#d663ed", "#ea5ec0", "#d55ffa", "#cb76b9", "#7b8fdf", "#f23dfa", "#f5654d", "#fb6038", "#da7b34", "#aa80df", "#c48642", "#8e9b24", "#ff586e", "#9484f3", "#cb832a", "#75a03e", "#9c85df", "#42a56f", "#e86893", "#0399f2", "#4d98de", "#4695f2", "#fb50ad", "#eb61ac", "#e36f80", "#f756a6", "#9a9725", "#d472b2", "#be8949", "#f75e80", "#ba76e6", "#ee55d3", "#fc6027", "#ca825e", "#f6653f", "#6aa062", "#7e9d55", "#4c9cc4", "#bb71fa", "#54a554", "#1da3aa", "#828af2", "#d57c5f", "#5aa445", "#c2856b", "#9d8ea4", "#c76fe6", "#f8641d", "#41a1a3", "#57a090", "#749b90", "#ab9056", "#aa89a5", "#ba895e", "#9a956a", "#aa8d84", "#af8e5d", "#6e99b1", "#939855", "#c18385", "#969297", "#9b928b", "#8e968a", "#789a97", "#a882d8", "#6fa054", "#13a961", "#99909e", "#e4725f", "#d16dd3", "#4993f9", "#ae8c78", "#819c62", "#db7b22", "#e064cc", "#7898a4", "#97983f", "#a686c5", "#899c01", "#1ba1bd", "#93957d", "#9186ec", "#d27c6c", "#d77e15", "#f76161", "#bd7bcc", "#c575d2", "#5b9ea4", "#7b97aa", "#4397eb", "#aa8e71", "#ad910a", "#44a389", "#bd8392", "#ab9230", "#ec6499", "#1ca689", "#a99240", "#8394b7", "#6e8ef2", "#6a9e83", "#c879b2", "#1596ff", "#e66c86", "#cd78a5", "#e865a6", "#8d9869", "#9c9647", "#e96b7a", "#7197b7", "#b28e4f", "#4c9eb0", "#a29507", "#c0893a", "#d871a6", "#c37abf", "#d18121", "#62a421", "#53a468", "#ea7019", "#dc7852", "#57a52b", "#e07717", "#879b4e", "#d466e6", "#43a81f", "#8a9b3f", "#e67152", "#72a122", "#52a63d", "#f54dcd", "#e360d3", "#fb559a", "#f258b9", "#f642e7", "#e1726c", "#f45ba0", "#e856e0", "#d87b4b", "#fb39e7", "#f63cf4", "#db5afa", "#d95ef3", "#39a83c", "#f847d3", "#e852ed", "#dc6bb9", "#cc74c5", "#fa614d", "#bc8b28", "#fa4cc0", "#df5de6", "#dc7199", "#e87136", "#35a91f", "#e96e60", "#ef6773", "#40a82a", "#f25f93", "#cc68f3", "#b47ae6", "#d76cc6", "#ea4cf4", "#29a853", "#ad78f9", "#da748c", "#e77145", "#eb6d4c", "#e563bf", "#3fa661", "#f941e0", "#5ca43d", "#f349e0", "#ed46fa", "#60a42b", "#ab7bf3", "#59a520", "#20a944", "#d766e0", "#6da13e", "#ba80b8", "#c27fa5", "#ad85b8", "#55a276", "#889a63", "#658ff9", "#7ba015", "#cc8151", "#61a083", "#889977", "#c98265", "#a680e6", "#b08b85", "#28a1b0", "#948ccb", "#928fb8", "#7e9e36", "#419cca", "#f3627a", "#c68272", "#63a16f", "#7e8de5", "#c3837f", "#1b9dd8", "#8990c4", "#8a8dd8", "#b782b2", "#a38e98", "#c68629", "#a984cb", "#9c8bbe", "#50a55b", "#e85ec6", "#6da05b", "#7596be", "#e86e66", "#6897cb", "#fa5d6e", "#df7835", "#32a396", "#bc82a5", "#839c5c", "#d37e43", "#f26660", "#b28c6b", "#d57e34", "#7e91d1", "#9e9371", "#dd7844", "#60a176", "#729f62", "#829d46", "#a09525", "#ba868b", "#da795f", "#c68457", "#61a262", "#ba7ec5", "#a48ab1", "#559bbe", "#c87e92", "#dd64d3", "#b88b49", "#f8615a", "#d57979", "#bd876b", "#8d9b2e", "#cf7f5e", "#f253c6", "#d8767f", "#9e87d2", "#ba8878", "#6f9aa4", "#d173b9", "#32a66f", "#d37c65", "#3da483", "#2fa2a3", "#9488df", "#919770", "#b385ab", "#7c9c70", "#599ac4", "#c8807f", "#97965c", "#f054cd", "#8b93ab", "#71a12c", "#e466b3", "#a89064", "#8d85f9", "#999655", "#6c9f6f", "#7192de", "#73a046", "#599db1", "#6092ec", "#7e9b7d", "#f656ad", "#cb8333", "#d67c58", "#779f54", "#439fb7", "#cc7d85", "#f55e87", "#ad83c5", "#8a9784", "#c57cac", "#e369a6", "#c98442", "#c88611", "#b081cb", "#998fab", "#719e76", "#3ca576", "#9c81f3", "#c67e98", "#d97492", "#a59256", "#a29263", "#e76999", "#51a096", "#6b9d90", "#3c9ade", "#8f9497", "#a39440", "#f9598d", "#4ba290", "#b28991", "#6b95d1", "#a29177", "#de7093", "#c38192", "#809897", "#a59430", "#8895a4", "#779b8a", "#d07a8c", "#ac9127", "#4098e5", "#5499d1", "#5b96de", "#7894c4", "#ea688d", "#a89248", "#cc7b98", "#569f9d", "#a28f8b", "#b3879e", "#a9905d", "#a68c9e", "#b58d39", "#999291", "#b38f0c", "#7295cb", "#d5759f", "#25a49d", "#a38ca4", "#fd50a7", "#7c989d", "#7399aa", "#b68885", "#a88f77", "#85997d", "#ae8b8b", "#819a76", "#6f9c97", "#36a1aa", "#ca7d8c", "#c0875e", "#ac8b91", "#a0917e", "#a58d91", "#879697", "#f951b3", "#8192c4", "#8b9691", "#7b9b83", "#ac8d7e", "#9c9705", "#49a19d", "#95948a", "#919584", "#8495aa", "#65a07d", "#91993f", "#8793b1", "#a08e9e", "#5ba17c", "#7797b1", "#969847", "#659ca4", "#bd7fb2", "#7f998a", "#8b949e", "#8097a4", "#92929e", "#ca8078", "#b98964", "#c38649", "#c78085", "#b58c5d", "#9690a4", "#5d99cb", "#87978a", "#c47e9f", "#8f9863", "#df6ab2", "#8c977d", "#3aa29d", "#8490cb", "#7c9a90", "#b78d28", "#af8998", "#9d945c", "#9a937e", "#8c9a55", "#5f9caa", "#cf7d79", "#9291ab", "#bd8b0f", "#fb5981", "#ad899e", "#b8887e", "#968fb1", "#2c9eca", "#949924", "#5ca08a", "#9d8db1", "#b48a78", "#51a289", "#99972f", "#9e9184", "#a88d8b", "#91985c", "#9c9463", "#b982ab", "#969577", "#749a9d", "#9c9097", "#a78aab", "#6598c4", "#8c8ecb", "#1ca77c", "#be819f", "#d672ac", "#bb8957", "#649bb1", "#3c9ec4", "#a48f84", "#988bc5", "#ae8e64", "#669e8a", "#aa9238", "#d067ed", "#f5626d", "#c28750", "#fe5c4d", "#c66cf3", "#8f8cd2", "#2aa683", "#9a964e", "#889c16", "#44a745", "#4ba383", "#dd784b", "#93966a", "#ed60a6", "#ad87ab", "#ee677a", "#9f89c5", "#b38e48", "#44a65a", "#da7679", "#989737", "#8b87f3", "#39a668", "#f0666d", "#b57cd9", "#f45f8d", "#aa86be", "#b087a5", "#da7b2c", "#d77b51", "#f15f99", "#bd8b1d", "#7a9d62", "#d96eb2", "#e961b3", "#5ba35b", "#ce6ed9", "#fd5c5a", "#cb6edf", "#f66546", "#cc71d2", "#bf70f3", "#6f9f69", "#e762b9", "#57a362", "#b08f30", "#6992e5", "#ac904f", "#df755f", "#21aa1e", "#64a412", "#e17552", "#d28014", "#f4680d", "#30a0b7", "#799f4d", "#71a04d", "#7490e5", "#da68cc", "#848ddf", "#a382df", "#77a036", "#e55bd9", "#9987d8", "#6fa135", "#ce8143", "#f06386", "#229cde", "#bc8685", "#47a568", "#ac82d2", "#f0694c", "#94984e", "#bf838b", "#f9640f", "#f26380", "#b278f3", "#63a345", "#6899b7", "#849d3e", "#799c76", "#d37a7f", "#38a90f", "#ec6a66", "#e07273", "#d97965", "#8e9a4e", "#c18829", "#f86427", "#d375a5", "#ef6a53", "#30a84c", "#c18572", "#5096e5", "#a6924f", "#cd6be6", "#ea6b73", "#65a33d", "#619f90", "#2fa761", "#4999d8", "#f3692f", "#4fa720", "#749e70", "#a49438", "#dc7b16", "#ae9041", "#f16945", "#dc766c", "#489dbd", "#5ea269", "#ef6d1b", "#6495d8", "#ea65a0", "#6391f2", "#cb79ac", "#369fbd", "#a69326", "#4fa645", "#ed6d3e", "#57a44c", "#5891f9", "#48a653", "#8c9b37", "#809d4d", "#d08133", "#e263c6", "#e57424", "#ee6d2e", "#e86b80", "#d67e21", "#b879df", "#d5778c", "#bd7dbf", "#3ca390", "#818fd8", "#2da934", "#9d9640", "#7f9c69", "#da65d9", "#b085b2", "#cd7f6c", "#cc8320", "#549eaa", "#f1693e", "#16a94c", "#619d9d", "#db7858", "#ea7124", "#6e9e7d", "#a37ef3", "#d17a85", "#eb55d9", "#7e94be", "#b9849e", "#8c8bdf", "#b68d31", "#de6ea6", "#819e23", "#b78692", "#ea7009", "#e36c93", "#b78a6b", "#5ba511", "#c08932", "#ac8e6a", "#fb603f", "#b17cdf", "#1baa2a", "#a185d8", "#47a73d", "#f752b9", "#768eec", "#c5845e", "#808cec", "#f96154", "#a287cb", "#9786e5", "#34a57c", "#c8826b", "#739d83", "#c974cc", "#a29447", "#d17c72", "#e6714c", "#859b55", "#c872d9", "#dd737f", "#3da0b0", "#fd601e", "#6ba321", "#f3691c", "#fe5874", "#e07723", "#cd814a", "#ac911b", "#ce76b2", "#b475fa", "#69a32c", "#d37792", "#b780bf", "#9984ec", "#c67ab8", "#fb40da", "#4aa476", "#f343ed", "#e56f73", "#67a169", "#50a37c", "#f36926", "#c78451", "#9f952f", "#6b98be", "#899b46", "#55a534", "#9b9719", "#f46553", "#bd8950", "#c5863a", "#989570", "#cb8158", "#7b8af9", "#c26dfa", "#ea6e53", "#7aa022", "#be76df", "#5897d8", "#8f9b17", "#c37cb2", "#e8713d", "#d769d3", "#e57418", "#20a95a", "#bb8498", "#d76fb9", "#978ad2", "#e17086", "#2d99eb", "#ff5b47", "#f26937", "#c48465", "#c370ed", "#b78d1d", "#01a875", "#8b9970", "#ca843b", "#4fa46f", "#b28f1c", "#e27544", "#d17899", "#df782c", "#909b02", "#8e90be", "#5ea435", "#67a254", "#a79308", "#7d9e3e", "#46a80f", "#74a114", "#40a74c", "#de783c", "#9e7ff9", "#df59f4", "#a181ec", "#f85e7a", "#d17f58", "#c58278", "#a788b8", "#c87ca5", "#bf78d2", "#cf73bf", "#4da72b", "#e17705", "#da6bbf", "#dc7386", "#c7861f", "#db7673", "#e557e6", "#da719f", "#bf8942", "#bd857e", "#b97bd2", "#e5699f", "#27a93c", "#d16ae0", "#879c23", "#11aa33", "#c977bf", "#cf789f", "#e56c8c", "#e9712e", "#5d9bb7", "#8a91b7", "#8989ec", "#1aa86f", "#af7fd9", "#bd73ec", "#c275d9", "#60a34d", "#b67ecc", "#6ba145", "#b08c71", "#f66167", "#929937", "#df67bf", "#ba8b3a", "#9f9456", "#7f9e2d", "#3496f9", "#e47435", "#ad7de6", "#fc4bba", "#a08ab8", "#ed6a60", "#ed6493", "#c173e6", "#a1951a", "#459bd1", "#798cf2", "#958dbe", "#f95d74", "#17a596", "#af7aec", "#fc6030", "#eb6b6d", "#d27e4a", "#e16d99", "#6794de", "#d46ccc", "#3794ff", "#5693f2", "#ea6e59", "#34a489", "#c07ac5", "#4f9fa3", "#b48d41", "#7891d8", "#869d2d", "#eb6886", "#d97b3c", "#3197f2", "#b08e56", "#d170c6", "#959918", "#7593d1", "#a0936a", "#5ea354", "#c378cc", "#d7796c", "#f3665a", "#3da834", "#669d97", "#7a96b7", "#d0812b", "#f76537", "#8f88e5", "#fc5c61", "#c28810", "#7c9d5c", "#869a69", "#d77d01", "#db6eac", "#3ba753", "#329dd1", "#e46f79", "#a49171", "#b677ec", "#bb8771", "#e37266", "#e57259", "#5395ec", "#e666ac", "#d47e3c", "#b083be", "#b78b50", "#e060d9", "#fb46cd", "#fe548d", "#fa5987", "#f833fb", "#d962e6", "#e453f4", "#ed4bed", "#ff44c0", "#d263f3", "#f34ed3", "#ec5db9", "#ef58c0", "#f93aed", "#f25ba6", "#cf64fa", "#ed59c6", "#dd61e0", "#ee50e0", "#dc5eed", "#eb51e7", "#f648da", "#f955a0", "#f15cad", "#fb31f4", "#e55fcc", "#f84dc6", "#e85ad3", "#f65a9a", "#fc5494", "#f457b3", "#e74dfa"];
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

/************************** Methods modals **************************/

var makeMethodParams = function(params){
  return function(div){
		//console.log(div[0][0].children)
		
    for (var key in params){
			var p = params[key];
			if(typeof p == 'function') continue; //Exclude Array prototype functions.
				
      var label = div.append("label")
      	.text(key).classed("param", true);
			
			label.node().id = key;
			//console.log(div[0][0].children, key)
				
      parseParams.apply(label, p);      
    }
  };
};

var parseParams = function(label, type, val, fields, fields_label){
  if(label)
    this.text(label);
  
	var input;

  if(type === 0){
		input = this.append("input").attr("type", "number");
  
	  if(!(typeof val === "undefined"))
  	  input.attr("value", val);
  }
	else if(type === 1){
		input = this.append("input").attr("type", "checkbox");
		if(val)
			input.attr("checked", true)
	}
  else if(type === 3){
  	input = this.append("select");
		
		if(fields.constructor === Array){
			input.selectAll("option")
				.data(fields)
				.enter()
				.append("option")
				.attr("value", function(d){return d[0];})
				.text(function(d){return d[1];})
			
		}else{
			input.selectAll("option")
				.data(Object.keys(fields))
				.enter()
				.append("option")
				.attr("value", function(d){return d;})
				.text(function(d){return fields[d][0];})			
			
			input.on("input", function(){
				d3.select(this.parentNode).select(".method_params").select("fieldset").remove();
			  d3.select(this.parentNode).select(".method_params")
			    .append("fieldset")
			  	.call(makeMethodParams(fields[this.value][1]))
				  .append("legend").text( fields_label? fields_label : "Parameters");
			});
			
			this.append("div")
				.classed("method_params", true)
				.append("fieldset")	
				.call(makeMethodParams(fields[input.node().value][1]))
				.append("legend").text(fields_label? fields_label : "Parameters");
		}
  }
  else if(type === 5){		
		this.text(" ");
    input = this.append("input").attr("type", "button")
			.attr("value", label)
    	.on("click", function(){ fireEvent(this, 'input') });
  }
	
  return input;
};

var methods = {}

methods.bl = 
{
	"a":["Baseline correction method", 3, null,
		{
			'cbf':["Constant",
				{"last":["Percentage of points used to calculate baseline", 0, 10]}
			], 
			'med':["Median filter",
				{
		     "mw":["Median window size",0,200],
		     "sf":["Smooth window size", 0,16],
		     "sigma":["sigma" , 0, 5],
		  	}
			],
			'polynom':["Polynomial", {"n":["Order", 0, 3]}],
			'cos':["Cosine series", {"n":["Order", 0, 3]}],
			'bern':["Bernstein polynomials", {"n":["Order", 0, 3]}],
			'iter_polynom':["Iterative Polynomial", {"n":["Order", 0, 3]}],			
			'airpls':["airPLS", {"n":["Order", 0, 1], "lambda":["lambda", 0, 10]}],
			'whit':["Whittaker smoother", {}],
			'th':["Tophat", {}],
			'als':["Asymmetric least squares", {}],
			'fft':["Low FFT filter", {}],
		}
	],
	"prev":["Preview", 3, null, [[0,"Estimated baseline"], [1,"Corrected spectrum"]] ],
	"prev_auto":["Auto Preview", 1, true],
	"prev_btn":["Apply Preview", 5, null]
};
methods.ps = 
{
	"a":["Phase correction method", 3, null,
		{
			'auto':["Automatic",
				{"opt":["Optimization", 3, null, 
						[['auto',"Sequential optimization of zero & first order phases"],
						['autosim',"Simultaneous optimization of zero & first order phases"],
						['auto0',"Zero order phase only"]] 
					],
				"obj":["Objective function", 3, null, 
						[['entropy', "Entropy minimization"],['integ', "Integral maximization"],['minp', "Minimum point maximization"]]
					]
				}
			], 
			'atan':["Automatic using Arc tan method",
				{"p0":["Zero order only", 1, false]}
			],
			'man':["Manual", 
				{
		     "p0":["Zero order",0,0],
		     "p1":["First order", 0,0]
		  	}
			],
		}
	],
	"prev_auto":["Auto Preview", 1, true],
	"prev_btn":["Preview Corrected", 5, null]
};var modals = {
	crosshair:true,
	peakpick:false,
	peakdel:false,
	integrate:false,	
}

modals.proto = function (title, content, ok_fun, cancel_fun) {	
	var nano = nanoModal(
		'<div><div class="title">' + (title?title:"Dialogue") +  '</div>' + content + '</div>',
		{
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
		]}
	);
	
	d3.select(nano.modal.el).on("keydown", function() {
		if (d3.event.keyCode===13) { // Enter
			d3.select(nano.modal.el).select(".nanoModalBtnPrimary").node().click();
		}
		if (d3.event.keyCode===27) { // Escape
			d3.select(nano.modal.el).select(".cancelBtn").node().click();
		}
	})
	
	nano.onShow(function () {
		var drag = d3.behavior.drag()
			.on("drag", function () {
				//console.log(d3.event.sourceEvent.pageX, d3.event.y)
		    d3.select(nano.modal.el)
		      .style("top", d3.event.sourceEvent.pageY+"px")
		      .style("left", d3.event.sourceEvent.pageX+"px")				
			});
		d3.select(nano.modal.el).select(".title").call(drag)
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

modals.bl = function () {
  var form_data = {};
	function oninput(){
		pro.bl(prev_bl, form_data);
		form_data = {}
	}
	var nano = modals.proto("Baseline correction","",
		function (modal) {
			modal.hide();
		}		
	);
	
	var el = d3.select(nano.modal.el).select(".nanoModalContent");
	el.call(makeMethodParams(methods.ps));
	console.log(el)
	
	var timer = null;
	el.on("input", function(){
	  d3.event.stopPropagation();
		if(timer)
			clearTimeout(timer);		

	  el.selectAll(".param")[0].forEach(function(e){
			//TODO: change to e.children[0].type ==="checkbox"
	    form_data[e.id] =  e.childNodes[1].value ==="on"? e.childNodes[1].checked :e.childNodes[1].value;
	  });

		if(form_data["prev_auto"])		
			timer = setTimeout(oninput, 300);
		else if(d3.event.target.type === 'button'){
			oninput();
		}
	});
	
	nano.show();
};
spec.menu = function(){
	var svg_elem, x, y, menu_on=false;
	
	function _main(svg) {		
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
			    children:[
			      {
							name:"Pick peaks",
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
					children:[
						{name:"Constant baseline correction",fun:function(){pro.bl(prev_bl, {a:"cbf"})} },
						{name:"Median baseline correction",fun:function(){pro.bl(prev_bl, {a:"med"})} },
						{name:"Advanced options",fun:modals.bl},
					],
				},
				{
					name:"View",
					children:[
						{
							name:"Change region",
							children:[
								{name:"Set X region",fun:modals.xRegion},
								{name:"Set Y region",fun:modals.yRegion},
								{name:"Full spectrum",fun:dispatcher.regionfull,
									children:[{name:"Set X region",fun:modals.xRegion},]
								},
								{name:"Reverse Spectrum",fun:null},
								{name:"Invert Phases",fun:null},
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
					.on("click", function(d){ if(d.fun){ toggle(); d.fun();}})

			arr2el(first, function (_sel) {
				var ret = _sel.append("div").append("ul").attr("class", "nav-column")
					.selectAll("li").data(function(d){return d.children});
				
				ret.enter()
				  .append("li")
						.append("a")
						.text(function(d){return d.name;})
						.attr("href", "#")
						.on("click", function(d){ if(d.fun){ toggle(); d.fun();}})
						.append("a")
						.text(function(d){return (d.children?" ▶":"")});
				
				return ret;
			});
			
		return svg_elem;									
	}
	
	function arr2el(sel, fun){
		var second = fun(sel.filter(function(d){return d.children;}));
	
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
					var new_slice = sliceDataIdx(data, x.domain(), range.x);
					if(data_slice && new_slice.start === data_slice.start && new_slice.end === data_slice.end)
						return;
					
					data_slice = new_slice;
					
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
				.range(d3.select(".main-focus").node().range.x)
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
			
			var elem  =spec.d1.line()
				.datum(spec_data)
				.xScale(x)
				.yScale(y)
				.crosshair(crosshair)
				.dispatcher(dispatcher)
				(focus);
			
			var x0 = d3.max(focus.selectAll(".spec-line")[0].map(function(s){return s.range.x[0]})),
					x1 = d3.min(focus.selectAll(".spec-line")[0].map(function(s){return s.range.x[1]})),
					y0 = d3.min(focus.selectAll(".spec-line")[0].map(function(s){return s.range.y[0]})),
					y1 = d3.max(focus.selectAll(".spec-line")[0].map(function(s){return s.range.y[1]}));
			
			var xdomain = x.domain(), ydomain = y.domain();
			
			focus.on("_rangechange")({x:[x0,x1], y:[y0,y1], norender: focus.node().nSpecs > 0});
			
			if(focus.node().nSpecs > 0)
				focus.on("_regionchange")({xdomain:xdomain});
			
			focus.node().nSpecs++;
			return elem;
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
		for (var i = 0; i < 3; i++) {
			pro.bl(function (data) {
				focus.node().addSpecLine(data).node().remove();
			}, {a:"cbf", prev:0});
		}
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
		//console.log(d3.selectAll(".spec-line"))
		
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

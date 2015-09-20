(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.specdraw = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(exports) {

  var bootstrap = (typeof exports.bootstrap === "object") ?
    exports.bootstrap :
    (exports.bootstrap = {});

  bootstrap.tooltip = function() {

    var tooltip = function(selection) {
        selection.each(setup);
      },
      animation = d3.functor(false),
      html = d3.functor(false),
      title = function() {
        var title = this.getAttribute("data-original-title");
        if (title) {
          return title;
        } else {
          title = this.getAttribute("title");
          this.removeAttribute("title");
          this.setAttribute("data-original-title", title);
        }
        return title;
      },
      over = "mouseenter.tooltip",
      out = "mouseleave.tooltip",
      placements = "top left bottom right".split(" "),
      placement = d3.functor("top");

    tooltip.title = function(_) {
      if (arguments.length) {
        title = d3.functor(_);
        return tooltip;
      } else {
        return title;
      }
    };

    tooltip.html = function(_) {
      if (arguments.length) {
        html = d3.functor(_);
        return tooltip;
      } else {
        return html;
      }
    };

    tooltip.placement = function(_) {
      if (arguments.length) {
        placement = d3.functor(_);
        return tooltip;
      } else {
        return placement;
      }
    };

    tooltip.show = function(selection) {
      selection.each(show);
    };

    tooltip.hide = function(selection) {
      selection.each(hide);
    };

    tooltip.toggle = function(selection) {
      selection.each(toggle);
    };

    tooltip.destroy = function(selection) {
      selection
        .on(over, null)
        .on(out, null)
        .attr("title", function() {
          return this.getAttribute("data-original-title") || this.getAttribute("title");
        })
        .attr("data-original-title", null)
        .select(".tooltip")
        .remove();
    };

    function setup() {
      var root = d3.select(this),
          animate = animation.apply(this, arguments),
          tip = root.append("div")
            .attr("class", "tooltip");

      if (animate) {
        tip.classed("fade", true);
      }

      // TODO "inside" checks?

      tip.append("div")
        .attr("class", "tooltip-arrow");
      tip.append("div")
        .attr("class", "tooltip-inner");

      var place = placement.apply(this, arguments);
      tip.classed(place, true);

      root.on(over, show);
      root.on(out, hide);
    }

    function show() {
      var root = d3.select(this),
          content = title.apply(this, arguments),
          tip = root.select(".tooltip")
            .classed("in", true),
          markup = html.apply(this, arguments),
          innercontent = tip.select(".tooltip-inner")[markup ? "html" : "text"](content),
          place = placement.apply(this, arguments),
          pos = root.style("position"),
          outer = getPosition(root.node()),
          inner = getPosition(tip.node()),
          style;

      if (pos === "absolute" || pos === "relative") {
          outer.x = outer.y = 0;
      }

      var style;
      switch (place) {
        case "top":
          style = {x: outer.x + (outer.w - inner.w) / 2, y: outer.y - inner.h};
          break;
        case "right":
          style = {x: outer.x + outer.w, y: outer.y + (outer.h - inner.h) / 2};
          break;
        case "left":
          style = {x: outer.x - inner.w, y: outer.y + (outer.h - inner.h) / 2};
          break;
        case "bottom":
          style = {x: Math.max(0, outer.x + (outer.w - inner.w) / 2), y: outer.y + outer.h};
          break;
      }

      tip.style(style ?
        {left: ~~style.x + "px", top: ~~style.y + "px"} :
        {left: null, top: null});

      this.tooltipVisible = true;
    }

    function hide() {
      d3.select(this).select(".tooltip")
        .classed("in", false);

      this.tooltipVisible = false;
    }

    function toggle() {
      if (this.tooltipVisible) {
        hide.apply(this, arguments);
      } else {
        show.apply(this, arguments);
      }
    }

    return tooltip;
  };

  function getPosition(node) {
    var mode = d3.select(node).style('position');
    if (mode === 'absolute' || mode === 'static') {
      return {
        x: node.offsetLeft,
        y: node.offsetTop,
        w: node.offsetWidth,
        h: node.offsetHeight
      };
    } else {
      return {
        x: 0,
        y: 0,
        w: node.offsetWidth,
        h: node.offsetHeight
      };
    }
  }

})(this);


},{}],2:[function(require,module,exports){
/*!
  * Bowser - a browser detector
  * https://github.com/ded/bowser
  * MIT License | (c) Dustin Diaz 2015
  */

!function (name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else this[name] = definition()
}('bowser', function () {
  /**
    * See useragents.js for examples of navigator.userAgent
    */

  var t = true

  function detect(ua) {

    function getFirstMatch(regex) {
      var match = ua.match(regex);
      return (match && match.length > 1 && match[1]) || '';
    }

    function getSecondMatch(regex) {
      var match = ua.match(regex);
      return (match && match.length > 1 && match[2]) || '';
    }

    var iosdevice = getFirstMatch(/(ipod|iphone|ipad)/i).toLowerCase()
      , likeAndroid = /like android/i.test(ua)
      , android = !likeAndroid && /android/i.test(ua)
      , chromeBook = /CrOS/.test(ua)
      , edgeVersion = getFirstMatch(/edge\/(\d+(\.\d+)?)/i)
      , versionIdentifier = getFirstMatch(/version\/(\d+(\.\d+)?)/i)
      , tablet = /tablet/i.test(ua)
      , mobile = !tablet && /[^-]mobi/i.test(ua)
      , result

    if (/opera|opr/i.test(ua)) {
      result = {
        name: 'Opera'
      , opera: t
      , version: versionIdentifier || getFirstMatch(/(?:opera|opr)[\s\/](\d+(\.\d+)?)/i)
      }
    }
    else if (/yabrowser/i.test(ua)) {
      result = {
        name: 'Yandex Browser'
      , yandexbrowser: t
      , version: versionIdentifier || getFirstMatch(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)
      }
    }
    else if (/windows phone/i.test(ua)) {
      result = {
        name: 'Windows Phone'
      , windowsphone: t
      }
      if (edgeVersion) {
        result.msedge = t
        result.version = edgeVersion
      }
      else {
        result.msie = t
        result.version = getFirstMatch(/iemobile\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/msie|trident/i.test(ua)) {
      result = {
        name: 'Internet Explorer'
      , msie: t
      , version: getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)
      }
    } else if (chromeBook) {
      result = {
        name: 'Chrome'
      , chromeBook: t
      , chrome: t
      , version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
      }
    } else if (/chrome.+? edge/i.test(ua)) {
      result = {
        name: 'Microsoft Edge'
      , msedge: t
      , version: edgeVersion
      }
    }
    else if (/chrome|crios|crmo/i.test(ua)) {
      result = {
        name: 'Chrome'
      , chrome: t
      , version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
      }
    }
    else if (iosdevice) {
      result = {
        name : iosdevice == 'iphone' ? 'iPhone' : iosdevice == 'ipad' ? 'iPad' : 'iPod'
      }
      // WTF: version is not part of user agent in web apps
      if (versionIdentifier) {
        result.version = versionIdentifier
      }
    }
    else if (/sailfish/i.test(ua)) {
      result = {
        name: 'Sailfish'
      , sailfish: t
      , version: getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/seamonkey\//i.test(ua)) {
      result = {
        name: 'SeaMonkey'
      , seamonkey: t
      , version: getFirstMatch(/seamonkey\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/firefox|iceweasel/i.test(ua)) {
      result = {
        name: 'Firefox'
      , firefox: t
      , version: getFirstMatch(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i)
      }
      if (/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(ua)) {
        result.firefoxos = t
      }
    }
    else if (/silk/i.test(ua)) {
      result =  {
        name: 'Amazon Silk'
      , silk: t
      , version : getFirstMatch(/silk\/(\d+(\.\d+)?)/i)
      }
    }
    else if (android) {
      result = {
        name: 'Android'
      , version: versionIdentifier
      }
    }
    else if (/phantom/i.test(ua)) {
      result = {
        name: 'PhantomJS'
      , phantom: t
      , version: getFirstMatch(/phantomjs\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/blackberry|\bbb\d+/i.test(ua) || /rim\stablet/i.test(ua)) {
      result = {
        name: 'BlackBerry'
      , blackberry: t
      , version: versionIdentifier || getFirstMatch(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/(web|hpw)os/i.test(ua)) {
      result = {
        name: 'WebOS'
      , webos: t
      , version: versionIdentifier || getFirstMatch(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
      };
      /touchpad\//i.test(ua) && (result.touchpad = t)
    }
    else if (/bada/i.test(ua)) {
      result = {
        name: 'Bada'
      , bada: t
      , version: getFirstMatch(/dolfin\/(\d+(\.\d+)?)/i)
      };
    }
    else if (/tizen/i.test(ua)) {
      result = {
        name: 'Tizen'
      , tizen: t
      , version: getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || versionIdentifier
      };
    }
    else if (/safari/i.test(ua)) {
      result = {
        name: 'Safari'
      , safari: t
      , version: versionIdentifier
      }
    }
    else {
      result = {
        name: getFirstMatch(/^(.*)\/(.*) /),
        version: getSecondMatch(/^(.*)\/(.*) /)
     };
   }

    // set webkit or gecko flag for browsers based on these engines
    if (!result.msedge && /(apple)?webkit/i.test(ua)) {
      result.name = result.name || "Webkit"
      result.webkit = t
      if (!result.version && versionIdentifier) {
        result.version = versionIdentifier
      }
    } else if (!result.opera && /gecko\//i.test(ua)) {
      result.name = result.name || "Gecko"
      result.gecko = t
      result.version = result.version || getFirstMatch(/gecko\/(\d+(\.\d+)?)/i)
    }

    // set OS flags for platforms that have multiple browsers
    if (!result.msedge && (android || result.silk)) {
      result.android = t
    } else if (iosdevice) {
      result[iosdevice] = t
      result.ios = t
    }

    // OS version extraction
    var osVersion = '';
    if (result.windowsphone) {
      osVersion = getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i);
    } else if (iosdevice) {
      osVersion = getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i);
      osVersion = osVersion.replace(/[_\s]/g, '.');
    } else if (android) {
      osVersion = getFirstMatch(/android[ \/-](\d+(\.\d+)*)/i);
    } else if (result.webos) {
      osVersion = getFirstMatch(/(?:web|hpw)os\/(\d+(\.\d+)*)/i);
    } else if (result.blackberry) {
      osVersion = getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i);
    } else if (result.bada) {
      osVersion = getFirstMatch(/bada\/(\d+(\.\d+)*)/i);
    } else if (result.tizen) {
      osVersion = getFirstMatch(/tizen[\/\s](\d+(\.\d+)*)/i);
    }
    if (osVersion) {
      result.osversion = osVersion;
    }

    // device type extraction
    var osMajorVersion = osVersion.split('.')[0];
    if (tablet || iosdevice == 'ipad' || (android && (osMajorVersion == 3 || (osMajorVersion == 4 && !mobile))) || result.silk) {
      result.tablet = t
    } else if (mobile || iosdevice == 'iphone' || iosdevice == 'ipod' || android || result.blackberry || result.webos || result.bada) {
      result.mobile = t
    }

    // Graded Browser Support
    // http://developer.yahoo.com/yui/articles/gbs
    if (result.msedge ||
        (result.msie && result.version >= 10) ||
        (result.yandexbrowser && result.version >= 15) ||
        (result.chrome && result.version >= 20) ||
        (result.firefox && result.version >= 20.0) ||
        (result.safari && result.version >= 6) ||
        (result.opera && result.version >= 10.0) ||
        (result.ios && result.osversion && result.osversion.split(".")[0] >= 6) ||
        (result.blackberry && result.version >= 10.1)
        ) {
      result.a = t;
    }
    else if ((result.msie && result.version < 10) ||
        (result.chrome && result.version < 20) ||
        (result.firefox && result.version < 20.0) ||
        (result.safari && result.version < 6) ||
        (result.opera && result.version < 10.0) ||
        (result.ios && result.osversion && result.osversion.split(".")[0] < 6)
        ) {
      result.c = t
    } else result.x = t

    return result
  }

  var bowser = detect(typeof navigator !== 'undefined' ? navigator.userAgent : '')

  bowser.test = function (browserList) {
    for (var i = 0; i < browserList.length; ++i) {
      var browserItem = browserList[i];
      if (typeof browserItem=== 'string') {
        if (browserItem in bowser) {
          return true;
        }
      }
    }
    return false;
  }

  /*
   * Set our detect method to the main bowser object so we can
   * reuse it to test other user agents.
   * This is needed to implement future tests.
   */
  bowser._detect = detect;

  return bowser
});

},{}],3:[function(require,module,exports){
(function(root, factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = function(d3) {
			d3.contextMenu = factory(d3);
			return d3.contextMenu;
		};
	} else {
		root.d3.contextMenu = factory(root.d3);
	}
}(	this, 
	function(d3) {
		return function (menu, openCallback) {

			// create the div element that will hold the context menu
			d3.selectAll('.d3-context-menu').data([1])
				.enter()
				.append('div')
				.attr('class', 'd3-context-menu');

			// close menu
			d3.select('body').on('click.d3-context-menu', function() {
				d3.select('.d3-context-menu').style('display', 'none');
			});

			// this gets executed when a contextmenu event occurs
			return function(data, index) {
				var elm = this;

				d3.selectAll('.d3-context-menu').html('');
				var list = d3.selectAll('.d3-context-menu').append('ul');
				list.selectAll('li').data(menu).enter()
					.append('li')
					.html(function(d) {
						return (typeof d.title === 'string') ? d.title : d.title(data);
					})
					.on('click', function(d, i) {
						d.action(elm, data, index);
						d3.select('.d3-context-menu').style('display', 'none');
					});

				// the openCallback allows an action to fire before the menu is displayed
				// an example usage would be closing a tooltip
				if (openCallback) {
					if (openCallback(data, index) === false) {
						return;
					}
				}

				// display context menu
				d3.select('.d3-context-menu')
					.style('left', (d3.event.pageX - 2) + 'px')
					.style('top', (d3.event.pageY - 2) + 'px')
					.style('display', 'block');

				d3.event.preventDefault();
				d3.event.stopPropagation();
			};
		};
	}
));

},{}],4:[function(require,module,exports){
var nanoModal;!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){function d(a,b){var c=document,d=a.nodeType||a===window?a:c.createElement(a),f=[];b&&(d.className=b);var g=e(),h=e(),i=function(a,b){d.addEventListener?d.addEventListener(a,b,!1):d.attachEvent("on"+a,b),f.push({event:a,handler:b})},j=function(a,b){d.removeEventListener?d.removeEventListener(a,b):d.detachEvent("on"+a,b);for(var c,e=f.length;e-->0;)if(c=f[e],c.event===a&&c.handler===b){f.splice(e,1);break}},k=function(a){var b=!1,c=function(c){b||(b=!0,setTimeout(function(){b=!1},100),a(c))};i("touchstart",c),i("mousedown",c)},l=function(a){d&&(d.style.display="block",g.fire(a))},m=function(a){d&&(d.style.display="none",h.fire(a))},n=function(){return d.style&&"block"===d.style.display},o=function(a){d&&(d.innerHTML=a)},p=function(a){d&&(o(""),d.appendChild(c.createTextNode(a)))},q=function(){if(d.parentNode){for(var a,b=f.length;b-->0;)a=f[b],j(a.event,a.handler);d.parentNode.removeChild(d),g.removeAllListeners(),h.removeAllListeners()}},r=function(a){var b=a.el||a;d.appendChild(b)};return{el:d,addListener:i,addClickListener:k,onShowEvent:g,onHideEvent:h,show:l,hide:m,isShowing:n,html:o,text:p,remove:q,add:r}}var e=a("./ModalEvent");b.exports=d},{"./ModalEvent":3}],2:[function(a,b,c){function d(a,b,c,f,g){if(void 0!==a){b=b||{};var h,i=e("div","nanoModal nanoModalOverride "+(b.classes||"")),j=e("div","nanoModalContent"),k=e("div","nanoModalButtons");i.add(j),i.add(k),i.el.style.display="none";var l,m=[];b.buttons=b.buttons||[{text:"Close",handler:"hide",primary:!0}];var n=function(){for(var a=m.length;a-->0;){var b=m[a];b.remove()}m=[]},o=function(){i.el.style.marginLeft=-i.el.clientWidth/2+"px"},p=function(){for(var a=document.querySelectorAll(".nanoModal"),b=a.length;b-->0;)if("none"!==a[b].style.display)return!0;return!1},q=function(){i.isShowing()||(d.resizeOverlay(),c.show(c),i.show(l),o())},r=function(){i.isShowing()&&(i.hide(l),p()||c.hide(c),b.autoRemove&&l.remove())},s=function(a){var b={};for(var c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);return b};return l={modal:i,overlay:c,show:function(){return f?f(q,l):q(),l},hide:function(){return g?g(r,l):r(),l},onShow:function(a){return i.onShowEvent.addListener(function(){a(l)}),l},onHide:function(a){return i.onHideEvent.addListener(function(){a(l)}),l},remove:function(){c.onRequestHide.removeListener(h),h=null,n(),i.remove()},setButtons:function(a){var b,c,d,f=a.length,g=function(a,b){var c=s(l);a.addClickListener(function(a){c.event=a||window.event,b.handler(c)})};if(n(),0===f)k.hide();else for(k.show();f-->0;)b=a[f],d="nanoModalBtn",b.primary&&(d+=" nanoModalBtnPrimary"),d+=b.classes?" "+b.classes:"",c=e("button",d),"hide"===b.handler?c.addClickListener(l.hide):b.handler&&g(c,b),c.text(b.text),k.add(c),m.push(c);return o(),l},setContent:function(b){return b.nodeType?(j.html(""),j.add(b)):j.html(b),o(),a=b,l},getContent:function(){return a}},h=c.onRequestHide.addListener(function(){b.overlayClose!==!1&&i.isShowing()&&l.hide()}),l.setContent(a).setButtons(b.buttons),document.body.appendChild(i.el),l}}var e=a("./El"),f=document,g=function(a){var b=f.documentElement,c="scroll"+a,d="offset"+a;return Math.max(f.body[c],b[c],f.body[d],b[d],b["client"+a])};d.resizeOverlay=function(){var a=f.getElementById("nanoModalOverlay");a.style.width=g("Width")+"px",a.style.height=g("Height")+"px"},b.exports=d},{"./El":1}],3:[function(a,b,c){function d(){var a={},b=0,c=function(c){return a[b]=c,b++},d=function(b){b&&delete a[b]},e=function(){a={}},f=function(){for(var c=0,d=b;d>c;++c)a[c]&&a[c].apply(null,arguments)};return{addListener:c,removeListener:d,removeAllListeners:e,fire:f}}b.exports=d},{}],4:[function(a,b,c){var d=a("./ModalEvent"),e=function(){function b(){if(!g.querySelector("#nanoModalOverlay")){var a=e("style"),b=a.el,h=g.querySelectorAll("head")[0].childNodes[0];h.parentNode.insertBefore(b,h);var i=".nanoModal{position:absolute;top:100px;left:50%;display:none;z-index:9999;min-width:300px;padding:15px 20px 10px;-webkit-border-radius:10px;-moz-border-radius:10px;border-radius:10px;background:#fff;background:-moz-linear-gradient(top,#fff 0,#ddd 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%,#fff),color-stop(100%,#ddd));background:-webkit-linear-gradient(top,#fff 0,#ddd 100%);background:-o-linear-gradient(top,#fff 0,#ddd 100%);background:-ms-linear-gradient(top,#fff 0,#ddd 100%);background:linear-gradient(to bottom,#fff 0,#ddd 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#dddddd', GradientType=0)}.nanoModalOverlay{position:absolute;top:0;left:0;width:100%;height:100%;z-index:9998;background:#000;display:none;-ms-filter:\"alpha(Opacity=50)\";-moz-opacity:.5;-khtml-opacity:.5;opacity:.5}.nanoModalButtons{border-top:1px solid #ddd;margin-top:15px;text-align:right}.nanoModalBtn{color:#333;background-color:#fff;display:inline-block;padding:6px 12px;margin:8px 4px 0;font-size:14px;text-align:center;white-space:nowrap;vertical-align:middle;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:1px solid transparent;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px}.nanoModalBtn:active,.nanoModalBtn:focus,.nanoModalBtn:hover{color:#333;background-color:#e6e6e6;border-color:#adadad}.nanoModalBtn.nanoModalBtnPrimary{color:#fff;background-color:#428bca;border-color:#357ebd}.nanoModalBtn.nanoModalBtnPrimary:active,.nanoModalBtn.nanoModalBtnPrimary:focus,.nanoModalBtn.nanoModalBtnPrimary:hover{color:#fff;background-color:#3071a9;border-color:#285e8e}";b.styleSheet?b.styleSheet.cssText=i:a.text(i),c=e("div","nanoModalOverlay nanoModalOverride"),c.el.id="nanoModalOverlay",g.body.appendChild(c.el),c.onRequestHide=d();var j=function(){c.onRequestHide.fire()};c.addClickListener(j),e(g).addListener("keydown",function(a){var b=a.which||a.keyCode;27===b&&j()});var k,l=e(window);l.addListener("resize",function(){k&&clearTimeout(k),k=setTimeout(f.resizeOverlay,100)}),l.addListener("orientationchange",function(){for(var a=0;3>a;++a)setTimeout(f.resizeOverlay,1e3*a+200)})}}var c,e=a("./El"),f=a("./Modal"),g=document;document.body&&b();var h=function(a,d){return b(),f(a,d,c,h.customShow,h.customHide)};return h.resizeOverlay=f.resizeOverlay,h}();nanoModal=e},{"./El":1,"./Modal":2,"./ModalEvent":3}]},{},[1,2,3,4]),"undefined"!=typeof window&&("function"==typeof window.define&&window.define.amd&&window.define(function(){return nanoModal}),window.nanoModal=nanoModal),"undefined"!=typeof module&&(module.exports=nanoModal);
},{}],5:[function(require,module,exports){
/*
 Copyright (c) 2012, Vladimir Agafonkin
 Simplify.js is a high-performance polyline simplification library
 mourner.github.com/simplify-js
*/

module.exports = simplify;

// to suit your point format, run search/replace for '.x' and '.y'
// to switch to 3D, uncomment the lines in the next 2 functions
// (configurability would draw significant performance overhead)


function getSquareDistance(p1, p2) { // square distance between 2 points

  var dx = p1.x - p2.x,
//      dz = p1.z - p2.z,
      dy = p1.y - p2.y;

  return dx * dx +
//         dz * dz +
         dy * dy;
}

function getSquareSegmentDistance(p, p1, p2) { // square distance from a point to a segment

  var x = p1.x,
      y = p1.y,
//      z = p1.z,

      dx = p2.x - x,
      dy = p2.y - y,
//      dz = p2.z - z,

      t;

  if (dx !== 0 || dy !== 0) {

    t = ((p.x - x) * dx +
//         (p.z - z) * dz +
         (p.y - y) * dy) /
            (dx * dx +
//             dz * dz +
             dy * dy);

    if (t > 1) {
      x = p2.x;
      y = p2.y;
//      z = p2.z;

    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
//      z += dz * t;
    }
  }

  dx = p.x - x;
  dy = p.y - y;
//  dz = p.z - z;

  return dx * dx +
//         dz * dz +
         dy * dy;
}

// the rest of the code doesn't care for the point format


function simplifyRadialDistance(points, sqTolerance) { // distance-based simplification

  var i,
      len = points.length,
      point,
      prevPoint = points[0],
      newPoints = [prevPoint];

  for (i = 1; i < len; i++) {
    point = points[i];

    if (getSquareDistance(point, prevPoint) > sqTolerance) {
      newPoints.push(point);
      prevPoint = point;
    }
  }

  if (prevPoint !== point) {
    newPoints.push(point);
  }

  return newPoints;
}


// simplification using optimized Douglas-Peucker algorithm with recursion elimination

function simplifyDouglasPeucker(points, sqTolerance) {

  var len = points.length,

      MarkerArray = (typeof Uint8Array !== undefined + '')
                  ? Uint8Array
                  : Array,

      markers = new MarkerArray(len),

      first = 0,
      last  = len - 1,

      i,
      maxSqDist,
      sqDist,
      index,

      firstStack = [],
      lastStack  = [],

      newPoints  = [];

  markers[first] = markers[last] = 1;

  while (last) {

    maxSqDist = 0;

    for (i = first + 1; i < last; i++) {
      sqDist = getSquareSegmentDistance(points[i], points[first], points[last]);

      if (sqDist > maxSqDist) {
        index = i;
        maxSqDist = sqDist;
      }
    }

    if (maxSqDist > sqTolerance) {
      markers[index] = 1;

      firstStack.push(first);
      lastStack.push(index);

      firstStack.push(index);
      lastStack.push(last);
    }

    first = firstStack.pop();
    last = lastStack.pop();
  }

  for (i = 0; i < len; i++) {
    if (markers[i]) {
      newPoints.push(points[i]);
    }
  }

  return newPoints;
}


function simplify(points, tolerance, highestQuality) {

  var sqTolerance = (tolerance !== undefined)
                  ? tolerance * tolerance
                  : 1;

  if (!highestQuality) {
    points = simplifyRadialDistance(points, sqTolerance);
  }
  points = simplifyDouglasPeucker(points, sqTolerance);

  return points;
};

},{}],6:[function(require,module,exports){
module.exports = function (){
	function getDataPoint (x_point, pixel_to_i, local_max) {
		var i;
    if(local_max){
      var s_window = [ pixel_to_i( x_point-10 ), pixel_to_i( x_point+10 ) ];

      i = s_window[0] + data.slice(s_window[0],s_window[1]+1).whichMax();
    }else{
      i = pixel_to_i( x_point );					
    }
		return data[i];
	}
	function registerDispatcher() {
		var suff = ".line."+dispatch_idx;
		dispatcher.on("regionchange"+suff, null);
		dispatcher.on("mouseenter"+suff, null);
		dispatcher.on("mouseleave"+suff, null);
		dispatcher.on("mousemove"+suff, null);	
		
		if( enabled ){
			dispatcher.on("regionchange"+suff, svg_elem.on("_regionchange"));
			dispatcher.on("mouseenter"+suff, function(){_main.show(true);});
			dispatcher.on("mouseleave"+suff, function(){_main.show(false);});
			if ( shown ){
				dispatcher.on("mousemove"+suff, svg_elem.on("_mousemove"));	
			}
		}
		dispatcher.on("specDataChange"+suff, function (s) {
			if(s === _main.parent()){_main.datum(s.datum());}
		});
		dispatcher.on("crosshairEnable"+suff, _main.enable);
	}
	
	var x, y, data, dispatcher;
	var svg_elem, dispatch_idx;
	var enabled, shown;
	
	var tip = d3.tip()
	  .attr('class', 'crosshair tooltip')
		.direction('ne')
	  .offset([0, 0])
		.bootstrap(true);
		
	var core = require('../elem');
	var source = core.SVGElem().class('crosshair');
	core.inherit(_main, source);
	
	function _main(spec_line) {
		x = _main.xScale();
		y = _main.yScale();
		dispatcher = _main.dispatcher();
		dispatch_idx = ++dispatcher.idx;
		enabled = shown = true;
				
		svg_elem = source(spec_line)
			.datum(null).call(tip); // I am clearing the data bound to the selection, not the Elem.
		
		svg_elem.append("circle")
			.attr("class", "clr"+ spec_line.lineIdx())
			.attr("r", 4.5)
			.on("click",function(){
				spec_line.sel().toggleClass("selected");
			})
			.on("mouseenter",function(){
				spec_line.sel().selectP('.main-focus').classed('dimmed', true);
				spec_line.sel().classed('highlighted', true);
			})
			.on("mouseleave",function(){
				spec_line.sel().selectP('.main-focus').classed('dimmed', false);
				spec_line.sel().classed('highlighted', false);
			});

		svg_elem
			.on("_regionchange", function(e){
				if(e.x){					
					svg_elem.datum(null);
					svg_elem.attr("transform", "translate(" + (-10000) + "," + (-10000) + ")");
				}else{
					var datum = svg_elem.datum();
					if(datum){
						svg_elem.attr("transform", "translate(" + x(datum.x) + "," + y(datum.y) + ")");						
					}
				}
			})
			.on("_mousemove", function(e){
        var p = getDataPoint(e.xcoor, spec_line.pixelToi, e.shiftKey);
      
        if(typeof p === 'undefined'){
					svg_elem.datum(null);
					return;
				}
				
				svg_elem.datum(p)
					.attr("transform", "translate(" + x(p.x) + "," + y(p.y) + ")");
				tip.text(d3.round(p.x,3)).show(svg_elem.node());
			})
			.on('remove', function () {
				_main.enabled(false);
				dispatcher.on("crosshairEnable.line."+dispatch_idx, null);
				data = null;
				tip.destroy();
			});
		
		registerDispatcher();
		return svg_elem;									
	}
	
	_main.show = function (_) {
		if (!arguments.length) {return shown;}
		shown = _;
		
		if (!svg_elem){return _main;}
		svg_elem.style("display", _? null : "none");
		
		if(_) { tip.show(svg_elem); }
		else{tip.hide();}
		
		registerDispatcher();
		return _main;
	};
	_main.enable = function (_) {
		if (!arguments.length) {return enabled;}
		enabled = _;
		
		return _main.show(_);
	};
  _main.datum = function(_){
    if (!arguments.length) {return data;}
    data = _;
    return _main;
  };
	return _main;
};

},{"../elem":18}],7:[function(require,module,exports){
function integrate(data){
	var _cumsum = data.map(function(d) { return d.y; }).cumsum();
	
	var ret = data.map(function(d,i){
		return {x:d.x, y:_cumsum[i]};
	});	
	return ret;
}

module.exports = function (){
	var core = require('../elem');
	var source = core.SVGElem().class('integration');
	core.inherit(IntegElem, source);
	
	var x, y, dispatcher, data;
	var svg_elem, path_elem, text_elem, path;
	var segment, integ_val, integ_factor, reduction_factor;
	
	
	function IntegElem(spec_line){
		function redrawPath() {			
			path_elem
				.datum(data)
				.attr("d", path);
			changeTextPos();
		}
		function changeTextPos() {
			var mid_p = path_elem.node()
				.getPointAtLength(0.5 * path_elem.node().getTotalLength());
	
			text_g.attr("transform", "translate("+ mid_p.x +","+ mid_p.y +")");
			changeText();
		}
		function changeText() {
			text_elem.datum(integ_val)
				.text((integ_val/integ_factor).toFixed(2));
			
			var bbox = text_elem.node().getBBox();
			//console.log(bbox, text_elem.text());
			text_elem.attr("dx", -bbox.width/2);
			
			redrawRect();
		}
		function redrawRect() {
			var bbox = text_elem.node().getBBox();
			//TODO: bbox is zero at rendering
			//console.log(bbox, text_elem.text());
			text_rect.attr("width", bbox.width +4)
				.attr("height", bbox.height +4)				
				.attr("x", bbox.x -2)
				.attr("y", bbox.y -2);
		}
		
		x = IntegElem.xScale();
		y = IntegElem.yScale();
		dispatcher = IntegElem.dispatcher();
		
		svg_elem = source(spec_line);
		IntegElem.updateData();
		if(!integ_factor){ integ_factor = integ_val; }
		if(!reduction_factor){ reduction_factor = 1; }
		
		
		
		
		path = d3.svg.line()
			.x(function(d) { return x(d.x); })
			.y(function(d) { return y(d.y/reduction_factor) - y.range()[0]*0.3; });
		
		
		path_elem = svg_elem.append("path")
			.attr("class", "line");
			
		var text_g = svg_elem.append("g")
			.attr("class", "integration-text");
			
		var text_rect = text_g.append("rect");
		
		text_elem = text_g.append("text");
		
		var modals = IntegElem.parentApp().modals();
		
		text_g.on("mouseenter", function () {
			svg_elem.classed("highlight", true);
		})
		.on("mouseleave", function () {
			svg_elem.classed("highlight", false);
		})
		.on("click", d3.contextMenu(
		  [{
 				title: 'Set integral',
 				action: modals.input("Set Integral to: ",
					text_elem.text(),
 					function (input) {
						integ_factor = text_elem.datum()/input;
						dispatcher.integ_refactor(integ_factor);
 					}
 				),
 			}]
		));
	
		redrawPath();
		svg_elem.on("_redraw", function (e) {
			if(e.x){
				redrawPath();
			}
		})
		.on("_refactor", function (e) {
			IntegElem.integFactor(e);
			changeText();
		})
		.on('_reduction_factor', function (e) {
			IntegElem.reductionFactor(e);
			redrawPath();
		});
		
		// Register event listeners
		
		var dispatch_idx = ++dispatcher.idx;
		dispatcher.on("redraw.integ."+dispatch_idx, svg_elem.on("_redraw"));
		dispatcher.on("integ_refactor."+dispatch_idx, svg_elem.on("_refactor"));
		dispatcher.on("specDataChange.integ."+dispatch_idx, function (s) {
			if(s === IntegElem.parent()){
				if(integ_factor === integ_val){ // if the integral is equal to 1.00, keep it.
					IntegElem.updateData();
					integ_factor = integ_val;
					dispatcher.integ_refactor(integ_factor);
				}else{
					IntegElem.updateData();
				}				
			}
		});
	}
	
		
	IntegElem.segment = function (_) {
		if (!arguments.length) {return segment;}
		segment = _;
		
		return IntegElem.updateData();
	};
	IntegElem.updateData = function () {
		if (! (segment && svg_elem) ) { // not initialized or no segments.
			integ_val = undefined;
			return IntegElem;
		}
		
		var spec_line = IntegElem.parent();
		data = integrate (Array.prototype.slice.apply( spec_line.datum(), segment ) );
		integ_val = data[ data.length-1 ].y;
		
		return IntegElem;
	};
	IntegElem.integFactor = function (_) {
		if (!arguments.length) {return integ_factor;}
		integ_factor = _;
		
		return IntegElem;
	};
	IntegElem.integValue = function (_) {
		if (!arguments.length) {return integ_val;}
		integ_val = _;
		
		return IntegElem;
	};
	IntegElem.reductionFactor = function (_) {
		if (!arguments.length) {return reduction_factor;}
		reduction_factor = _;
		
		if (IntegElem.sel()){
			IntegElem.sel().on('_redraw')({x:true});
		}
		return IntegElem;
	};
	return IntegElem;
};

},{"../elem":18}],8:[function(require,module,exports){
function calcReductionFactor(spec_container) {
	var seg_len = [];
	var specs = spec_container.spectra();
	for (var i = 0; i < specs.length; i++) {
		seg_len = seg_len.concat(
			specs[i].segments(true).map(
			function (s) {
				return s.integValue();
			})
		);
	}
	
	var red = d3.max( seg_len ) / (spec_container.yScale().domain()[1]*0.5);
	
	spec_container.spectra().forEach(function (s) {
		s.segments(true).forEach(function (seg) {
			seg.reductionFactor(red);
		});
	});
	
	return d3.max( seg_len ) / 0.5;
}
function get_integ_factor(spec_container) {
	var specs = spec_container.spectra();
	var integ_factor;
	for (var i = 0; i < specs.length; i++) {
		var segs = specs[i].segments();
		for (var j = 0; j < segs.length; j++) {
			integ_factor = segs[j].integFactor();
			if(integ_factor){ return integ_factor;}
		}
	}
}

module.exports = function () {
	var core = require('../elem');
	var path_elem = require('./path-simplify')();
	var source = core.SVGElem().class('spec-line');
	core.inherit(SpecLine, source);
	
	
	var data, s_id, spec_label, _crosshair;	//initiailized by parent at generation
	var x, y, dispatcher;								//initiailized by parent at rendering
	var line_idx, range={}, svg_elem;		//initialized by self at rendering
	var i_to_pixel; 										//a scale to convert data point to pixel position
	var ppm_to_i; 											//a scale to convert ppm to data point (reverse of data[i].x)
	
	var selected = true;
	var data_slice, scale_factor = 1;
	var peaks = [], segments = core.ElemArray();
	
	
	function SpecLine(spec_container) {
		x = SpecLine.xScale();
		y = SpecLine.yScale();
		dispatcher = SpecLine.dispatcher();
		i_to_pixel = x.copy();
		
		//var width = spec_container.width();
		line_idx = spec_container.spectra().indexOf(SpecLine);
		svg_elem = source(spec_container)
			.classed('selected', selected)
			.classed('clr'+line_idx, true);
		
		
				
		path_elem.datum(data)
			.xScale(x)
			.yScale(y)
			.simplify(1)
			.class("line")
			(svg_elem);
		
		if(typeof _crosshair === 'undefined'){
			SpecLine.crosshair(true);
		}
		if(_crosshair){
			_crosshair.xScale(x)
				.yScale(y)
				.dispatcher(dispatcher)
				(SpecLine);
		}
			
		for (var i = 0; i < segments.length; i++) {
			render_segment(segments[i]);
		}
		
		svg_elem
			.on("_redraw", function(e){
				if(e.x){
					path_elem.redraw().sel()
						.attr("transform", 'scale(1,1)translate(0,0)');
					
					//integration
					calcReductionFactor(spec_container);
				}else{ //change is in the Y axis only.
					var orignial_yscale = y.copy().domain(spec_container.range().y);
					
					var translate_coor = [0,
		 				-Math.min(orignial_yscale(y.domain()[1]), orignial_yscale(y.domain()[0]) )];

					var	scale_coor = [ 1,
					  Math.abs((spec_container.range().y[0]-spec_container.range().y[1])/(y.domain()[0]-y.domain()[1]))];
				
					path_elem.sel()
						.attr("transform","scale("+scale_coor+")"+"translate("+ translate_coor +")");
				}
			})
			.on("_regionchange", function(e){
				if(e.xdomain){
					data_slice = e.xdomain.map(SpecLine.ppmToi);
					i_to_pixel.domain( data_slice );
					
					//TODO: resample factors both x and y dimensions.
					// Both dimension need to have the same unit, i.e. pixels.										
					path_elem.datum( Array.prototype.slice.apply(data, data_slice) );
					range.y = path_elem.range().y;
					range.y[0] *= scale_factor;
					range.y[1] *= scale_factor;
					
				}
			})
			.on("_integrate", function(e){
				var s = e.xdomain.map(SpecLine.ppmToi).sort(d3.ascending);
				SpecLine.addSegment(s);
			})
			.on("_segment", function () {
			});
		
		// Register event listeners
		var dispatch_idx = ++dispatcher.idx;
		dispatcher.on("regionchange.line."+dispatch_idx, svg_elem.on("_regionchange"));
		dispatcher.on("redraw.line."+dispatch_idx, svg_elem.on("_redraw"));
		dispatcher.on("integrate.line."+dispatch_idx, svg_elem.on("_integrate"));
		
		svg_elem.on('remove', function () {
			dispatcher.on("regionchange.line."+dispatch_idx, null);
			dispatcher.on("redraw.line."+dispatch_idx, null);
			dispatcher.on("integrate.line."+dispatch_idx, null);
			data = null;
			if(_crosshair){
				_crosshair.remove();				
			}
		});
		
		//SpecLine.addSegment([1000,1050]);
		return svg_elem;									
	}
	function render_segment(s) {
		if (!svg_elem){ return; }
		
		s.xScale(x).yScale(y)
			.dispatcher(dispatcher)
			(SpecLine);
	}
	function redraw(x, y) {
		if (!svg_elem){ return; }
		svg_elem.on("_redraw")({x:x, y:y});
	}
	function render_data() {
		//TODO: Update peaks, integrate, segments to match new data.
		if (!svg_elem){ return; }
		svg_elem.on("_regionchange")({xdomain:x.domain()});
		svg_elem.on("_redraw")({x:true});
	}
	
	SpecLine.addSegment = function (_) {
		var integ_elem = require('./integration-elem')()
			.segment(_)
			.integFactor(get_integ_factor(SpecLine.parent()));
		
		segments.push(integ_elem);
		
		render_segment(integ_elem);
		calcReductionFactor( SpecLine.parent() );
	};
	SpecLine.delSegment = function (between) {
		segments = segments.filter(function (e) {
			//retain all peaks NOT within the region.
			return !(e >= between[0] && e <= between[1]);
		});
	};
	SpecLine.segments = function (visible) {
		var idx = segments;
		if(visible){ //get only peaks in the visible range (within dataSlice)
			idx = idx.filter(function (s) {
				var e = s.segment();
				return e[0] > data_slice[0] && 
					e[0] < data_slice[1] &&
					e[1] > data_slice[0] && 
					e[1] < data_slice[1];
			});
		}
		return idx;
	};
	SpecLine.addPeaks = function (idx) {
		peaks = peaks.concat(idx);
	};
	SpecLine.delPeaks = function (between) {
		between = between.map(SpecLine.ppmToi).sort(d3.ascending);
		peaks = peaks.filter(function (e) {
			//retain all peaks NOT within the region.
			return !(e >= between[0] && e <= between[1]);
		});
	};
	SpecLine.peaks = function (visible) {
		var idx = peaks;
		if(visible){ //get only peaks in the visible range (within dataSlice)
			idx = idx.filter(function (e) {
				return e > data_slice[0] && e < data_slice[1];
			});
		}
		return data.subset(idx);
	};
	SpecLine.iToPixel = function (_) {
		return i_to_pixel(_);
	};
	SpecLine.pixelToi = function (_) {
		return Math.round( i_to_pixel.invert(_) );
	};
	SpecLine.ppmToi = function (_) {
		console.log('ppm', _);
		var i = Math.round( ppm_to_i(_) );
		i = i > data.length-1 ? data.length-1 : i;
		i = i < 0 ? 0 : i;
		
		if (data[i-1] && Math.abs(_ - data[i].x) > Math.abs(_ - data[i-1].x) ){
			i--;
		}else if(data[i+1] && Math.abs(_ - data[i].x) > Math.abs(_ - data[i+1].x) ){
			i++;
		}
		return i;
	};
  SpecLine.range = function () {
  	return range;
  };
	SpecLine.datum = function(_){
    if (!arguments.length) {return data;}
		if(!_[0].x){ //if data is array, not xy format
			if ( data  && data.length === _.length){ // if we are replacing existing data
				// Use the x-coordinates of the old data.
				data = _.map(function(d,i){ return {x:data[i].x, y:d}; });
			}else{
				// Otherwise, create a linespace over the x-axis 
				// over the range of the parent container.
				var xscale = d3.scale.linear()
					.range(SpecLine.parent().range().x)
					.domain([0, _.length]);
			
				data = _.map(function(d,i){ return {x:xscale(i), y:d}; });				
			}
		}else{ // Data is in XY format.
    	data = _;
		}
		
		range.x = [data[0].x, data[data.length-1].x];
		range.y = d3.extent(data.map(function(d) { return d.y; }));
		
		ppm_to_i = d3.scale.linear()
			.range([0, data.length])
			.domain([ data[0].x, data[data.length-1].x ]);
		
		//TODO: Update peaks, integrate, segments to match new data.
		if(dispatcher)
			{dispatcher.specDataChange(SpecLine);}

		render_data();
    return SpecLine;
  };
  SpecLine.label = function(_){
    if (!arguments.length) {return spec_label;}
    spec_label = _;
    return SpecLine;
  };
  SpecLine.crosshair = function(_){
    if (!arguments.length) {return _crosshair;}
		
		if(_){
			_crosshair = require('./crosshair')().datum(data);
		} else {
			_crosshair = false;
		}			
		
    return SpecLine;
  };
  SpecLine.s_id = function(_){
    if (!arguments.length) {return s_id;}
    s_id = _;
    return SpecLine;
  };	
  SpecLine.selected = function(_){
    if (!arguments.length) {return selected;}
    selected = _;
    return SpecLine;
  };
	SpecLine.lineIdx = function () {
		return line_idx;
	};
	SpecLine.scaleFactor = function (_) {
		if (!arguments.length) {return scale_factor;}
		scale_factor = _;
		redraw();
		return SpecLine;
	};
	
	return SpecLine;
};

},{"../elem":18,"./crosshair":6,"./integration-elem":7,"./path-simplify":10}],9:[function(require,module,exports){
module.exports = function (){
	var x, y, dispatcher;
	var svg_elem, _brush;
	var core = require('../elem');
	var source = core.SVGElem().class('main-brush');
	core.inherit(MainBrush, source);
	
	function makeBrushEvent() {
		if (_brush.empty()){
			if(x && y) {_brush.extent([[0,0],[0,0]]);}
			else{ _brush.extent([0,0]); }
			
			svg_elem.call(_brush);
			return null;
  	}
		var e = {};
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
	}
	function changeRegion () {			
		var e = makeBrushEvent();
		if(e)
			{MainBrush.parent().changeRegion(e);}
  }		
	function peakdel () {
		var e = makeBrushEvent();
		if(e)
			{dispatcher.peakdel(e);}
  }
	function integrate () {
		var e = makeBrushEvent();
		if(e)
			{dispatcher.integrate(e);}
  }
	function peakpick() {
		_brush.clear();
		svg_elem.call(_brush);
	}
	
	function MainBrush(spec_container) {		
		x = MainBrush.xScale();
		y = MainBrush.yScale();
		dispatcher = MainBrush.dispatcher();
		
		
	  _brush = d3.svg.brush()
			.x(x)
			.y(y)
	    .on("brushend", changeRegion);
		
		svg_elem = source(spec_container)
			.call(_brush);

		svg_elem.selectAll("rect")
			.attr("height", spec_container.height());
		
		svg_elem.select(".background")
			.style('cursor', null)
			.style('pointer-events', 'all');
		
		svg_elem.on('peakpickEnable', function (_) {
			svg_elem.classed("peakpick-brush", _);
			MainBrush.parent().sel().classed("peakpick-brush", _);
			
			_brush.on("brushend", _? peakpick : changeRegion);
		})
		.on('peakdelEnable', function (_) {
			svg_elem.classed("peakdel-brush", _);
			MainBrush.parent().sel().classed("peakdel-brush", _);
			
			_brush.on("brushend", _? peakdel : changeRegion);
		})
		.on('integrateEnable', function (_) {
			svg_elem.classed("integrate-brush", _);
			MainBrush.parent().sel().classed("integrate-brush", _);
			
			_brush.on("brushend", _? integrate : changeRegion);
		});
	
		// Register event listeners
		var dispatch_idx = ++dispatcher.idx;		
		dispatcher.on("peakpickEnable.brush."+dispatch_idx, svg_elem.on('peakpickEnable'));
		dispatcher.on("peakdelEnable.brush."+dispatch_idx, svg_elem.on('peakdelEnable'));
		dispatcher.on("integrateEnable.brush."+dispatch_idx, svg_elem.on('integrateEnable'));
		
		return svg_elem;									
	}

	return MainBrush;
};

},{"../elem":18}],10:[function(require,module,exports){
module.exports = function () {
	var utils = require('../utils');
	var core = require('../elem');
	var source = core.ResponsiveElem('path');
	core.inherit(PathElem, source);
	
	
	var data;	//initiailized by parent at generation
	var x, y;								//initiailized by parent at rendering
	var range={}, svg_elem;		//initialized by self at rendering
	var data_resample, simplify_val, path_fun;
	
	function PathElem(spec_line) {
		x = PathElem.xScale();
		y = PathElem.yScale();
	
		path_fun = d3.svg.line()
			.interpolate('linear')
			.x(function(d) { return x(d.x); })
			.y(function(d) { return y(d.y); });
		
		svg_elem = source(spec_line);
		return svg_elem;			
	}
	function update_range() {
		range.x = [data_resample[0].x, data_resample[data_resample.length - 1].x];
		range.y = d3.extent(data_resample.map(function (d) { return d.y; }));
	}
	PathElem.redraw = function () {
		if ( !svg_elem ){return PathElem;}
		svg_elem.attr("d", path_fun);
		return PathElem;
	};
	PathElem.update = function () {
		if ( !svg_elem ){return PathElem;}
		
		if(simplify_val){
			data_resample = utils.simplify(data, x, simplify_val);
			console.log('simplify', data_resample.length);
		}else{
			data_resample = data;
		}
		
		svg_elem.datum(data_resample);
		update_range();
		return PathElem;
	};
	PathElem.range = function () {
		return range;
	};
	PathElem.datum = function (_) {
		if (!arguments.length) {return data;}
		data = _;
		
		return PathElem.update();
	};
	PathElem.simplify = function (_) {
		if (!arguments.length) {return simplify_val;}
		simplify_val = _;
		return PathElem;
	};
	
	
	return PathElem;
};

},{"../elem":18,"../utils":36}],11:[function(require,module,exports){
var contextMenu = require('d3-context-menu')(d3);

function peakLine(line_x, line_y, label_x){
	var bottom = Math.max(line_y - 10, 60);
	return d3.svg.line()
		.defined(function(d) { return !isNaN(d[1]); })
		([
		[label_x, 40], 
		[line_x, 60],
		[line_x, 80],
		[NaN, NaN],
		[line_x, bottom - 10],
		[line_x, bottom]
		]);
}

function adjust_peak_positions(_peaks, text_width, container_width) {
	var tw = text_width;
	var current_pos = container_width - tw;
	//console.log('start', container_width, tw, _peaks);
	for (var i = 0; i < _peaks.length; i++) {
		//console.log(_peaks[i].d.x, _peaks[i].pos, current_pos );
		if(_peaks[i].pos > current_pos){
			_peaks[i].pos = current_pos;
		}
		current_pos = _peaks[i].pos - tw;
	}
	
	if(current_pos < tw){ // if the rightmost peak is out of canvas.
		current_pos = tw;
		for (i = _peaks.length - 1; i >= 0; i--) {
			if( _peaks[i].pos < current_pos ){
				_peaks[i].pos = current_pos;
				current_pos = _peaks[i].pos + tw;
			}else{
				break;
			}
		}
	}
	return _peaks;		
}

function getPeaks(spec_container) {
	var spectra = spec_container.spectra();
	var x = spec_container.xScale();
	var all_peaks = [];
	for (var i = 0; i < spectra.length; i++) {
		var p = spectra[i].peaks(true).map(function (d) {
			return {line:spectra[i].lineIdx(), pos:x(d.x), d:d};
		});
		all_peaks = all_peaks.concat(p);
	}
	all_peaks = all_peaks.sort(function (a, b) {
		return d3.descending(a.pos, b.pos);
	});
	return all_peaks;
}

module.exports = function(){
	var menu = [
		{
			title: 'Delete peak',
			action: function(elm, d) {
				_main.parent().spectra().filter(function (s) {
						return s.lineIdx() === d.line;
					})[0]
					.delPeaks([d.d.x, d.d.x]);
				dispatcher.peakpick();
			}
		}
	];
	function update_text() {
		var peak_text = svg_elem.selectAll("text")
			.data(_peaks);

		peak_text.enter()
			.append("text")
			.attr("dy", "0.35em")
			.attr("focusable", true)
			.on("focus", function(){});

		peak_text.exit().remove();
	}

	function update_lines() {
		var peak_line = svg_elem.selectAll("path")
			.data(_peaks);

		peak_line.enter()
			.append("path")
			.style("fill", "none");	
	
		peak_line.exit().remove();
	}

	function redraw_text() {
		svg_elem.selectAll("text").text(function(d){return d3.round(d.d.x ,3);})
			.attr("transform", function (d) {
				return "translate(" + d.pos + ",0)rotate(90)";
			})
			.attr('class', function (d) {
				return 'peak-text clr' + d.line;	
			})
			.on("keydown", function(d) {
				if(d3.event.keyCode===68){
					dispatcher.peakdel({xdomain:[d.d.x, d.d.x]});
				}
			})
			.on('click', contextMenu(menu));
	}

	function redraw_lines() {		  
		svg_elem.selectAll("path")
			.attr("d", function(d){return peakLine( x(d.d.x), y(d.d.y), d.pos );})
			.attr('class', function (d) {
				return 'peak-line clr' + d.line;	
			});
	}
	
	function get_text_width() {
		var dummy_elem = svg_elem.append("text").text('any');
		
		// Using heigth because text will be rotated.
		var text_width = dummy_elem.node().getBBox().height;
		dummy_elem.remove();
		return text_width;		
	}
	
	var svg_elem, x, y, dispatcher;
	var _peaks = [];
	
	var core = require('../elem');
	var source = core.SVGElem().class('peaks');
	core.inherit(_main, source);
	
	function _main(spec_container) {

		x = _main.xScale();
		y = _main.yScale();
		dispatcher = _main.dispatcher();
		
		var width = spec_container.width();
		svg_elem = source(spec_container);
		
		
		svg_elem
			.on("_click", function(e){
				var spectra = spec_container.spectra();
				
				spectra.forEach(function (s) {
					if(s.crosshair()){ // If there is a crosshair, get its current data. 
						s.crosshair().sel().on("_mousemove")(e);
						var p = s.crosshair().sel().datum();
						if(p){
							console.log(p, s.ppmToi(p.x));
							s.addPeaks( s.ppmToi(p.x) );
						}
					}else{
						s.addPeaks( s.pixelToi(e.xcoor) );
					}
				});
				dispatcher.peakpick();
			})
			.on("_regionchange", function (e) {
				if(e.xdomain){
					_peaks = getPeaks(spec_container);
					_peaks = adjust_peak_positions(_peaks, get_text_width(), width);
				}
			})
			.on("_redraw", function(e){
				if(e.x){
					update_text();
					update_lines();
					
					if (_peaks.length === 0){return;}
					redraw_text();
				}
				redraw_lines();
			})
			.on("_peakpick", function () {
				svg_elem.on("_regionchange")({xdomain:true});
				svg_elem.on("_redraw")({x:true, y:true});
			})
			.on("_peakdel", function (e) {
				if(e.xdomain){
					spec_container.spectra().forEach(function (s) {
						s.delPeaks(e.xdomain);
					});
				}
				if(e.ydomain){
					//TODO: delete peaks based on y-coordinates
				}
				dispatcher.peakpick();
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
		
		return svg_elem;						
	}
	
	_main.peaks = function () {
		return getPeaks(_main.parent());
	};
		
	return _main;
};

},{"../elem":18,"d3-context-menu":3}],12:[function(require,module,exports){
module.exports = function(){
	var svg_elem, x, y, dispatcher,brushscale;
	
	var core = require('../elem');
	var source = core.SVGElem().class('scale-brush');
	core.inherit(_main, source);
	
	function _main(slide) {
		x = _main.xScale();
		y = _main.yScale();
		dispatcher = _main.dispatcher();
		
		var mainscale = x? x : y;
		brushscale = x? x.copy() : y.copy();
		
    var axis = d3.svg.axis()
			.scale(brushscale)
			.orient(x? "bottom": "top")
			.tickFormat(d3.format("s"));
    
    var _brush = d3.svg.brush()
      .x(brushscale)
			.on("brushstart",function(){d3.event.sourceEvent.stopPropagation();})
			.on("brushend", function () {//test x or y domain?
				var extent = _brush.empty()? brushscale.domain() : _brush.extent().reverse();
				extent = extent.sort(brushscale.domain()[0] > brushscale.domain()[1]?
					d3.descending : d3.ascending );
				
				slide.changeRegion( x ? {xdomain:extent}	: {ydomain:extent} );
			});
		
		svg_elem = source(slide)
			.classed( x ?  "x" : "y", true)
			.attr("transform", x? "translate(0," + -20 + ")"
				: "translate(-20," + 0 + ")rotate("+90+")"
			);

    svg_elem.append("g")
	    .call(axis)
			.attr("class", "brush-axis");
    
        
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
					var domain = process_domains(mainscale.domain(), brushscale.domain());
					_brush.extent(domain);
				}
			})
			.on("_redraw", function(e){
				if(e.x || (e.y && y))
					{svg_elem.select(".brush").call(_brush);}
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
		
		if(domain.join() === brush.join())
			{domain = [0,0];}
		
		return domain;
	}
	return _main;
};

},{"../elem":18}],13:[function(require,module,exports){

module.exports = function () {
	var core = require('../elem');
	var source = core.SVGElem().class('main-focus');
	core.inherit(SpecContainer, source);
	
	
	var focus, x, y, dispatcher, data, range = {};
	var specs = core.ElemArray();
	var peak_picker = require('./peak-picker')();
	var main_brush = require('./main-brush')();

	var zoomer = d3.behavior.zoom()
		.on("zoom", function () {
			/* * When a y brush is applied, the scaled region should go both up and down.*/
			var new_range = range.y[1]/zoomer.scale() - range.y[0];
			var addition = (new_range - (y.domain()[1] - y.domain()[0]))/2;
		
			var new_region = [];
			if(y.domain()[0] === range.y[0]) { new_region[0] = range.y[0]; }
			else{new_region[0] = Math.max(y.domain()[0]-addition, range.y[0]);}
			new_region[1] = new_region[0] + new_range;
			
			focus.on("_regionchange")(
				{zoom:true,	ydomain:new_region}
			);
		});

	
	function SpecContainer(slide) {
		x = SpecContainer.xScale();
		y = SpecContainer.yScale();
		dispatcher = SpecContainer.dispatcher();
		
		focus = source(slide)
	    .attr("pointer-events", "all")
			.attr('clip-path', "url(#" + slide.clipId() + ")")
			.attr("width", SpecContainer.width())
			.attr("height", SpecContainer.height())
			.call(zoomer)
			.on("dblclick.zoom", null)
			.on("mousedown.zoom", null);
		
		
		// overlay rectangle for mouse events to be dispatched.
		focus.append("rect")
			.attr("width", SpecContainer.width())
			.attr("height", SpecContainer.height())
			.style("fill", "none");
		
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
					if(!e.zoom){//If y domain is changed by brush, adjust zoom scale
						zoomer.scale((range.y[0]-range.y[1])/(y.domain()[0]-y.domain()[1]));						
					} 
				}else{
					//modify range.y  and reset the zoom scale
					var y0 = d3.min(specs.map(function(s){return s.range().y[0];})),
						y1 = d3.max(specs.map(function(s){return s.range().y[1];}));
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
				if(e.x) { range.x = e.x; }	
				if(e.y) { range.y = e.y; }
			
				dispatcher.rangechange(e);
				
				if(!e.norender){
					focus.on("_regionchange")({xdomain:range.x, ydomain:range.y});
				} 
			})
			.on("mouseenter", dispatcher.mouseenter)
			.on("mouseleave", dispatcher.mouseleave)
			.on("mousemove", function(){
				var new_e = d3.event;
				new_e.xcoor = d3.mouse(this)[0];
				new_e.ycoor = d3.mouse(this)[1];
			
				dispatcher.mousemove(new_e);
			})
			.on("mousedown", function () {	// Why?! because no brush when cursor on path?
			  var new_click_event = new Event('mousedown');
			  new_click_event.pageX = d3.event.pageX;
			  new_click_event.clientX = d3.event.clientX;
			  new_click_event.pageY = d3.event.pageY;
			  new_click_event.clientY = d3.event.clientY;
			  focus.select(".main-brush").node()
					.dispatchEvent(new_click_event);
			})
			.on("click", function(){
				var new_e = d3.event;
				new_e.xcoor = d3.mouse(this)[0];
				new_e.ycoor = d3.mouse(this)[1];
		
				dispatcher.click(new_e);
			})
			.on("dblclick", dispatcher.regionfull);

		dispatcher.on("regionfull",function () {
			focus.on("_regionchange")({xdomain:range.x});		
		});
			
		//brushes
		main_brush.xScale(x)
			.dispatcher(dispatcher)
			(SpecContainer);
	

		//spectral lines
		for (var i = 0; i < specs.length; i++) {
			render_spec(specs[i]);
		}
	
		//peak picker	
		peak_picker.xScale(x)
			.yScale(y)
			.dispatcher(dispatcher)
			(SpecContainer);
		
	}
	function update_range() {
		var x0 = d3.max(specs.map(function(s){return s.range().x[0];})),
			x1 = d3.min(specs.map(function(s){return s.range().x[1];})),
			y0 = d3.min(specs.map(function(s){return s.range().y[0];})),
			y1 = d3.max(specs.map(function(s){return s.range().y[1];}));

		// Add 5% margin to top and bottom (easier visualization).
		var y_limits = (y1-y0);
		y0 = y0 - (0.05 * y_limits);
		y1 = y1 + (0.05 * y_limits);

		var xdomain = x.domain();

		focus.on("_rangechange")({x:[x0,x1], y:[y0,y1], norender: specs.length > 1});

		if(specs.length > 1){
			focus.on("_regionchange")({xdomain:xdomain});	
		}
	}
	
	function render_spec(s) {
		if(!focus){return;}
		
		s.xScale(x).yScale(y)
			.dispatcher(dispatcher)
			(SpecContainer);
				
		update_range();
	}
	
	SpecContainer.changeRegion = function (_) {
		if( focus ){
			focus.on('_regionchange')(_);
		}
	};
	SpecContainer.addSpec = function(spec_data, crosshair){
		if (!arguments.length) {
			throw new Error("appendSlide: No data provided.");
		} 
		
		if(typeof crosshair === 'undefined'){
			crosshair = true;
		}
		
		// TODO: s_id is only present in 'connected' mode.
		var s_id = null;
		var spec_label = 'spec'+specs.length;
		console.log(spec_data['label']);

		if(typeof spec_data["s_id"] !== 'undefined') {s_id = spec_data["s_id"];}
		if(typeof spec_data['label'] !== 'undefined') {spec_label = spec_data["label"];}
		spec_data = spec_data["data"];
		
		// Find the spectrum with the same s_id.
		// If it is present, overwrite it.
		// Otherwise, create a new spectrum.
		var s = specs.filter(function (e) {
			return e.s_id() === s_id;
		}	);
		console.log('addspec', s, s_id);
		if ( s.length === 0 ){
		 	s = require('./line')()
				.datum(spec_data)
				.crosshair(crosshair)
				.s_id(s_id)
				.label(spec_label);
			
			specs.push(s);
			render_spec(s);
		}else{
			s = s[0];
			s.datum(spec_data);//TODO: setData!!
			update_range();
		}		
		
		return s;
	};
	SpecContainer.addPeaks = function (idx) { //TODO:move peaks to line
		if(!focus){return;}
		focus.select(".peaks").node().addpeaks(data.subset(idx));			
		focus.select(".peaks").on("_regionchange")({xdomain:true});
		focus.select(".peaks").on("_redraw")({x:true});			
	};
	SpecContainer.nd = function(){
		return 1;
	};
	SpecContainer.spectra = function (selected) {
		if (!selected){return specs;}
		
		return  specs.filter( function (s) { return s.selected(); } );
	};
	SpecContainer.highlightSpec = function (_) {
		var s_idx = specs.indexOf(_);
		if(s_idx < 0){ //no spectrum to highlight
			specs.sel().classed('dimmed', false)
				.classed('highlighted', false);
		}else{
			specs.sel().classed('dimmed', false);
			_.sel().classed('highlighted', true);
		}		
	};
	SpecContainer.peakPicker = function () {
		return peak_picker;
	};
	SpecContainer.mainBrush = function () {
		return main_brush;
	};
	SpecContainer.range = function(){
		return range;
  };
  SpecContainer.datum = function(_){
    if (!arguments.length) {return data;}
    data = _;
		
		//TODO: Clear all spectra first.
		SpecContainer.addSpec(_);
    return SpecContainer;
  };
	
	
	return SpecContainer;
};
},{"../elem":18,"./line":8,"./main-brush":9,"./peak-picker":11}],14:[function(require,module,exports){
module.exports = function () {
	var svg_elem, x, y, dispatcher;
	var core = require('../elem');
	var source = core.ResponsiveElem('path').class('threshold line x');
	core.inherit(_main, source);
		
	function _main(spec_container, callback) {
		x = _main.xScale() || spec_container.xScale();
		y = _main.yScale() || spec_container.yScale();
		dispatcher = _main.dispatcher() || spec_container.dispatcher();
		
		svg_elem = source(spec_container)
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

	return _main;	
};
},{"../elem":18}],15:[function(require,module,exports){
module.exports = function(){
	function registerDispatcher() {
		var suff = ".line."+dispatch_idx;
		dispatcher.on("regionchange"+suff, null);
		dispatcher.on("mouseenter"+suff, null);
		dispatcher.on("mouseleave"+suff, null);
		dispatcher.on("mousemove"+suff, null);	
		
		if( enabled ){
			dispatcher.on("regionchange"+suff, svg_elem.on("_regionchange"));
			dispatcher.on("mouseenter"+suff, function(){_main.show(true);});
			dispatcher.on("mouseleave"+suff, function(){_main.show(false);});
			if ( shown ){
				dispatcher.on("mousemove"+suff, svg_elem.on("_mousemove"));	
			}
		}
		dispatcher.on("crosshairEnable"+suff, _main.enable);
	}
	
	var core = require('../elem');
	var source = core.SVGElem().class('crosshair');
	core.inherit(_main, source);
	
	var svg_elem, x, y, dispatcher, dispatch_idx;
	var enabled, shown;
	var tip = d3.tip()
	  .attr('class', 'crosshair tooltip')
		.direction('ne')
	  .offset([0, 0])
		.bootstrap(true);
	
	
	function _main(spec_img) {
		x = _main.xScale();
		y = _main.yScale();
		dispatcher = _main.dispatcher();
		dispatch_idx = ++dispatcher.idx;
		enabled = shown = true;
		
		svg_elem = source(spec_img)
			.classed("clr" + spec_img.lineIdx(), true)
			.datum(null).call(tip);

		var crosslines = svg_elem.append("g")
			.attr("class", "crosshair line");
		
		
		var xline = crosslines.append("path")
			.attr("class", "crosshair line x");
		
		var yline = crosslines.append("path")
			.attr("class", "crosshair line y");
		
		var cross_circle = svg_elem.append("circle")
			.attr("r", 4.5);

		//TODO: select / highlight spectrum from dataset.

		svg_elem
			.on("_regionchange", function(){
					//TODO: update coordinates
			})
			.on("_mousemove", function(e){
				var data_point = [x.invert(e.xcoor), y.invert(e.ycoor)];
				
				svg_elem.datum(data_point);
				cross_circle.attr("transform", "translate(" + e.xcoor + "," + e.ycoor + ")");
				tip.text(
					d3.round(data_point[0],2) + ', ' + d3.round(data_point[1],2)
				).show(cross_circle.node());
				
				xline.attr('d', d3.svg.line()
					( [[x.range()[0], e.ycoor], [x.range()[1], e.ycoor]] )
				);
				yline.attr('d', d3.svg.line()
					( [[e.xcoor, y.range()[0]], [e.xcoor, y.range()[1]]] )
				);
			})
			.on('remove', function () {
				_main.enabled(false);
				dispatcher.on("crosshairEnable.line."+dispatch_idx, null);
				tip.destroy();
			});
				
		registerDispatcher();
		return svg_elem;									
	}
	
	_main.show = function (_) {
		if (!arguments.length) {return shown;}
		shown = _;
		
		if (!svg_elem){return _main;}
		svg_elem.style("display", _? null : "none");
		
		if(_) { tip.show(svg_elem); }
		else{tip.hide();}
		
		registerDispatcher();
		return _main;
	};
	_main.enable = function (_) {
		if (!arguments.length) {return enabled;}
		enabled = _;
		
		return _main.show(_);
	};
	return _main;
};

},{"../elem":18}],16:[function(require,module,exports){
module.exports = function () {
	var core = require('../elem');
	var source = core.SVGElem().class('main-focus');
	core.inherit(SpecContainer, source);

	var x, y, dispatcher, data;
	var focus, range = {};
	var specs = core.ElemArray();
	var main_brush = require('../d1/main-brush')();
	
	var zoomer = d3.behavior.zoom()
		.on("zoom", function (){
			d3.select("#rfunc").attr("slope", zoomer.scale());
			d3.select("#bfunc").attr("slope", zoomer.scale());
		}).scaleExtent([0.1,100]);	
	
	function SpecContainer(slide) {
		x = SpecContainer.xScale();
		y = SpecContainer.yScale();
		dispatcher = SpecContainer.dispatcher();
		
		focus = source(slide)
	    .attr("pointer-events", "all")
			.attr('clip-path', "url(#" + slide.clipId() + ")")
			.attr("width", SpecContainer.width())
			.attr("height", SpecContainer.height())
			.call(zoomer)
			.on("dblclick.zoom", null)
			.on("mousedown.zoom", null);
				
		
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
					{range.x = e.x;}
				if(e.y)
					{range.y = e.y;}
			
				dispatcher.rangechange(e);
				
				if(!e.norender){
					focus.on("_regionchange")({xdomain:range.x, ydomain:range.y});
				} 
			})
			.on("mouseenter", dispatcher.mouseenter)
			.on("mouseleave", dispatcher.mouseleave)
			.on("mousemove", function(){
				var new_e = d3.event;
				new_e.xcoor = d3.mouse(this)[0];
				new_e.ycoor = d3.mouse(this)[1];
			
				dispatcher.mousemove(new_e);
			})
			.on("mousedown", function () {	// Why?! because no brush when cursor on path?
			  var new_click_event = new Event('mousedown');
			  new_click_event.pageX = d3.event.pageX;
			  new_click_event.clientX = d3.event.clientX;
			  new_click_event.pageY = d3.event.pageY;
			  new_click_event.clientY = d3.event.clientY;
			  focus.select(".main-brush").node()
					.dispatchEvent(new_click_event);
			})
			.on("click", function(){
				var new_e = d3.event;
				new_e.xcoor = d3.mouse(this)[0];
				new_e.ycoor = d3.mouse(this)[1];
		
				dispatcher.click(new_e);
			})
			.on("dblclick", dispatcher.regionfull);

		dispatcher.on("regionfull",function () {
			focus.on("_regionchange")({xdomain:range.x, ydomain:range.y});		
		});
		
		//spectral lines
		for (var i = 0; i < specs.length; i++) {
			render_spec(specs[i]);
		}
		//brushes
		main_brush
			.xScale(x)
			.yScale(y)
			.dispatcher(dispatcher)
			(SpecContainer);
		
	}
	function render_spec(s) {
		if(!focus){return;}
		console.log(s);
		s.xScale(x).yScale(y)
			.dispatcher(dispatcher)
			(SpecContainer);
				
		update_range();
	}
	function update_range() {
		var x0 = d3.max(specs.map(function(s){return s.range().x[0];})),
			x1 = d3.min(specs.map(function(s){return s.range().x[1];})),
			y0 = d3.min(specs.map(function(s){return s.range().y[0];})),
			y1 = d3.max(specs.map(function(s){return s.range().y[1];}));
		

		var xdomain = x.domain(), ydomain = y.domain();
		focus.on("_rangechange")({x:[x0,x1], y:[y0,y1], norender: specs.length > 1});

		if(specs.length > 1){
			focus.on("_regionchange")({xdomain:xdomain, ydomain:ydomain});
		}
	}
	
	SpecContainer.addSpec = function(spec_data, crosshair){
		if (!arguments.length) {
			throw new Error("appendSlide: No data provided.");
		} 
		
		if(typeof crosshair === 'undefined'){
			crosshair = true;
		}
		var s = specs.filter(function (e) {
			return e.s_id() === spec_data["s_id"];
		}	);
		
		if ( s.length === 0 ){
			s = require('./spec2d')()
				.datum(spec_data["data"])
				.s_id(spec_data["s_id"])
				.label(spec_data["label"])
				.crosshair(crosshair)
				.range({x:spec_data["x_domain"], y:spec_data["y_domain"]});
				
			specs.push(s);
		}else{
			s = s[0];
			s.datum(spec_data["data"])
				.range({x:spec_data["x_domain"], y:spec_data["y_domain"]});
		}
		render_spec(s);
		return s;
	};
	SpecContainer.hightlightSpec = function(){};
	SpecContainer.changeRegion = function (_) {
		if( focus ){
			focus.on('_regionchange')(_);
		}
	};
	SpecContainer.nd = function(){
		return 2;
	};
	SpecContainer.spectra = function () {
		return specs;
	};
	SpecContainer.range = function(){
		return range;
  };
  SpecContainer.datum = function(_){
    if (!arguments.length) {return data;}
    data = _;
		
		SpecContainer.addSpec(_);
    return SpecContainer;
  };
	return SpecContainer;	
};
},{"../d1/main-brush":9,"../elem":18,"./spec2d":17}],17:[function(require,module,exports){
module.exports = function () {
	var core = require('../elem');
	var source = core.SVGElem().class('spec-img');
	core.inherit(_main, source);
	
	var data, s_id, spec_label, _crosshair;	//initiailized by parent at generation
	var x, y, dispatcher;								//initiailized by parent at rendering
	var svg_elem, img_elem, line_idx, range={};		//initiailized by self at rendering
	
	
	function _main(spec_container) {
		x = _main.xScale();
		y = _main.yScale();
		dispatcher = _main.dispatcher();
		
		svg_elem = source(spec_container);
		line_idx = spec_container.spectra().indexOf(_main);
		
		//svg_elem.attr("clip-path","url(#" + svg_elem.selectP('.spec-slide').node().clip_id + ")");

		img_elem = svg_elem.append("g")
			.attr("filter", "url(#2dColorFilter)")
			.append("svg:image")
			  .attr('width', spec_container.width())
			  .attr('height', spec_container.height())
			  .attr('xlink:href', "data:image/ png;base64," + data)
			  .attr("preserveAspectRatio", "none");	
				
		
		/*** TODO: 2D dataset vis *****
		******************************/
		
		if(_crosshair){
			_crosshair 
				.xScale(x).yScale(y)
				.dispatcher(dispatcher)
				(_main);
		}
			
		
		// TODO: 2D integration
		
		svg_elem
			.on("_redraw", redraw)
			.on("_regionchange", function(){
			})
			.on("_integrate", function(){
			})
			.on("_segment", function () {
			})
			.on('_remove', function () {
				dispatcher.on("regionchange.line."+dispatch_idx, null);
				dispatcher.on("redraw.line."+dispatch_idx, null);
				data = null;
				if(_crosshair){_crosshair.remove();}
			});
		
		// Register event listeners
		var dispatch_idx = ++dispatcher.idx;
		dispatcher.on("regionchange.line."+dispatch_idx, svg_elem.on("_regionchange"));
		dispatcher.on("redraw.line."+dispatch_idx, svg_elem.on("_redraw"));
				
		return svg_elem;									
	}
	function redraw() {
		if (!img_elem) {return;}
		
		var orignial_xscale = x.copy().domain(range.x),
			orignial_yscale = y.copy().domain(range.y);

		//zooming on 2d picture by first translating, then scaling.
		var translate_coor = [-Math.min(orignial_xscale(x.domain()[1]), orignial_xscale(x.domain()[0])),
			 				-Math.min(orignial_yscale(y.domain()[1]), orignial_yscale(y.domain()[0]) )];

		var	scale_coor = [ Math.abs((range.x[0]-range.x[1])/(x.domain()[0]-x.domain()[1])),
						   Math.abs((range.y[0]-range.y[1])/(y.domain()[0]-y.domain()[1]))];

		img_elem.attr("transform","scale("+scale_coor+")"+"translate("+ translate_coor +")");
	}
	function render_data() {
		if (!img_elem) {return;}
		
		img_elem.attr('xlink:href', "data:image/ png;base64," + data);
		redraw();
	}
	
  _main.datum = function(_){
    if (!arguments.length) {return data;}
		data = _;
		
		render_data();
		return _main;
  };
  _main.range = function(_){
		if (!arguments.length) {return range;}
		range = _;
		return _main;
  };
  _main.crosshair = function(_){
    if (!arguments.length) {return _crosshair;}

		if(_){
			_crosshair = require('./crosshair-2d')();
		} else {
			_crosshair = false;
		}    return _main;
  };
  _main.s_id = function(_){
    if (!arguments.length) {return s_id;}
    s_id = _;
    return _main;
  };
  _main.label = function(_){
    if (!arguments.length) {return spec_label;}
    spec_label = _;
    return _main;
  };
	_main.lineIdx = function () {
		return line_idx;
	};
	
	return _main;
};

},{"../elem":18,"./crosshair-2d":15}],18:[function(require,module,exports){

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

},{}],19:[function(require,module,exports){
var events = {
	crosshair:true,
	peakpick:false,
	peakdel:false,
	integrate:false,
	zoom:["x", "y", false]
}

events.crosshairToggle = function (app) {
	events.crosshair = !events.crosshair;
	app.slideDispatcher().crosshairEnable(events.crosshair);
}

events.peakpickToggle = function (app) {
	if(events.zoom[0] !== false)	events.zoom.rotateTo(false);	
	if(events.peakdel !== false)	events.peakdelToggle(app);
	if(events.integrate !== false)	events.integrateToggle(app);
	
	console.log(events.zoom)
	events.peakpick = !events.peakpick;
	app.slideDispatcher().peakpickEnable(events.peakpick);
}

events.peakdelToggle = function (app) {
	if(events.zoom[0] !== false)	events.zoom.rotateTo(false);	
	if(events.peakpick !== false)	events.peakpickToggle(app);
	if(events.integrate !== false)	events.integrateToggle(app);	
	
	events.peakdel = !events.peakdel;
	app.slideDispatcher().peakdelEnable(events.peakdel);	
}

events.integrateToggle = function (app) {
	if(events.zoom[0] !== false)	events.zoom.rotateTo(false);	
	if(events.peakpick !== false)	events.peakpickToggle(app);
	if(events.peakdel !== false) events.peakdelToggle(app);

	events.integrate = !events.integrate;
	app.slideDispatcher().integrateEnable(events.integrate);	
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

events.registerKeyboard = function(app){
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
			app.slideDispatcher().log("keyCode: " + d3.event.keyCode);
			
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
			
			
			app.slideDispatcher().keyboard(d3.event);
	  });
};
module.exports = events;

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


},{}],20:[function(require,module,exports){
module.exports = {};
module.exports.App = require('./main_app');
module.exports.hooks = {};
module.exports.hooks.readers = require('./pro/plugin-hooks');
module.exports.get_spectrum = require('./pro/process_data').get_spectrum;
module.exports.version = "0.5.2";
//console.log("specdraw:"+ spec.version);
},{"./main_app":22,"./pro/plugin-hooks":31,"./pro/process_data":33}],21:[function(require,module,exports){
var inp = {};
var fireEvent = require('./utils').fireEvent;

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
	return function () { return elem.node();	};
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
		.text(typeof label === 'string' ? label : '');
	
	elem.node().getValue = function(){ 
		return elem.select('input').node().checked;
	};
	return function () { return elem.node();	};
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
	return function () { return elem.node();	};
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
        d3.select(this).append(inp.checkbox(d, true));
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
	};
	return function () { return elem.node();	};
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
				.append(inp.div( options[select_elem.value][1] ));
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
		.on("click", function(){ fireEvent(this, 'input'); });
	
	elem.node().getValue = function(){ 
		return d3.event && d3.event.target === elem.node();
	};	
	return function(){return elem.node();};
};
inp.threshold = function (label, axis, app) {
	console.log('app: ',app);
	var elem = d3.select(document.createElement('div'))
	.classed('param threshold', true);
	
	var input = elem.append("input").attr("type", "hidden");

	var val = elem.append("input")
		.attr("type", "text")
		.attr('readonly', 'readonly');
	
	elem.insert(inp.button(label), ':last-child')
  	.on("click", function(){ 
			var modal = d3.selectAll(".nanoModalOverride:not([style*='display: none'])")
				.style('display', 'none');
			
			//TODO: app-specific.
			var th_fun = require('./d1/threshold')();
			
			th_fun(app.currentSlide().specContainer(), function (t) {
				val.attr('value', t.toExponential(2));
				input.attr('value', t);
				modal.style('display', 'block');
			});
				
		});
	
	elem.node().getValue = function () {
		return input.node().value;
	};
	return function() { return elem.node(); };
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
inp.div = function (div_data, app) {
	var div = d3.select(document.createElement('div'));
  for (var key in div_data){
		var p = div_data[key];
		if(typeof p === 'function') {continue;} //Exclude Array prototype functions.
		div.append(parseInputElem.apply(null, p.concat(app)))
			.node().id = key;
  }
	
	return function() {return div.node();};
};

var parseInputElem = function (label, type, details, app) {
	var f = [
		inp.num, inp.checkbox, inp.text, inp.select_toggle,
		inp.checkbox_toggle, inp.button, inp.threshold
	][type];
	
	var args = [label].concat(details);
	args = type === 6 ? args.concat(app) : args;
	return f.apply(null, args);
};

inp.spectrumSelector = function (app) {
	var specs = app.currentSlide().spectra();
	var spec_container = app.currentSlide().specContainer();
	
	if (specs.length === 0){
		return function () {
			return d3.select(document.createElement('div')).text('No Spectra to show').node();
		};
	} 
		
	var elem = 	d3.select(
		inp.select_multi('Select Spectrum', specs)()
		).classed('spec-selector', true);
	
	elem.selectAll('li')
	  	.each(function(s){
				d3.select(this).select('.checkbox')					
					.style('color', getComputedStyle(s.select('path').node()).stroke)
					.select('.label').text( s.label() );
					
				d3.select(this).on('mouseenter', function () {
					spec_container.highlightSpec(s);
				})//mouseover
				.on('mouseleave', function () {
					spec_container.highlightSpec();
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
	var inner = div.append('div').classed('popover-inner', true);
	inner.append('h3').classed('popover-title', true).text(title);
	inner.append('div').classed('popover-content', true);
	
	return function() {return div.node();};
};

module.exports = inp;
},{"./d1/threshold":14,"./utils":36}],22:[function(require,module,exports){
module.exports = function(){
	var core = require('./elem');
	var source = core.Elem().class('spec-app');
	core.inherit(App, source);
	
  var selection, svg_width, svg_height;
	var app_dispatcher = d3.dispatch('slideChange', 'slideContentChange', 'menuUpdate');
	var modals;
	var slides = core.ElemArray(), current_slide;
	
  function App(div){
		svg_width = App.width();
		svg_height = App.height();
		
    /* * Check size definitions**/
		if (typeof svg_width === 'undefined' ||
			typeof svg_height === 'undefined' ||
			isNaN(svg_width) || isNaN(svg_height)
		){
				var parent_svg = div.node();
				var dimensions = parent_svg.clientWidth ? [parent_svg.clientWidth, parent_svg.clientHeight]
					: [parent_svg.getBoundingClientRect().width, parent_svg.getBoundingClientRect().height];
				
				svg_width = dimensions[0]; //deduct 50px for column menu.
				svg_height = dimensions[1];
		}
		
    if (svg_width < 400 || svg_height < 400){
      throw new Error("SpecApp: Canvas size too small. Width and height must be at least 400px");
    }
		
		selection = source(div)
			.style({
				width:svg_width,
				height:svg_height				
			});
		
		svg_width -= 50; //deduct 50px for column menu.
		
		modals = require('./modals')(App);
		require('./menu/menu')(App);

		/**** Keyboard events and logger ****/
		require('./events').registerKeyboard(App);
		
		selection.node().appendToCurrentSlide = function (data) {
			var current_slide = selection.select('.spec-slide.active').node();
			if(!current_slide){
				selection.node().appendSlide(data);
			}	else{
				current_slide.addSpec(data);
				app_dispatcher.slideContentChange();
			}
		};
		
		//selection.node().options = App.options;
		app_dispatcher.on('slideChange.app', function (s) {
			if (current_slide !== s) { App.currentSlide(s);	}
		});
		
		for (var i = 0; i < slides.length; i++) {
			render_slide(slides[i]);
		}
	}
	function render_slide(s) {
		if(! selection){ return; }
		s.width(svg_width).height(svg_height)
			(App);
		
		App.currentSlide(s);
	}
	
	App.slides = function () {
		return slides;
	};
	App.currentSlide = function (s) {
		if (!arguments.length) { return current_slide; }
		if (current_slide) { // When the first slide is added, no current_slide.
			current_slide.show(false);
		}
		s.show(true);
		current_slide = s;
		app_dispatcher.slideChange(s);
	};
	App.dispatcher = function () {
		return app_dispatcher;
	};
	App.slideDispatcher = function () {
		return current_slide.slideDispatcher();
	};
	App.modals = function () {
		return modals;
	};
	App.pluginRequest = require('./pro/plugins')(App);
	App.appendSlide = function(data){
		if (!arguments.length){
			throw new Error("appendSlide: No data provided.");
		} 
		
		var s = require('./slide')().datum(data);
		slides.push(s);
		render_slide(s);
		return App;
	};
	App.appendToCurrentSlide = function(data){
		if (!arguments.length){
			throw new Error("appendToCurrentSlide: No data provided.");
		} 
		
		if (selection){
			selection.node().appendToCurrentSlide(data);
		} else{
			if(slides.length === 0){ //No slides available; create a new one
				return App.appendSlide(data);
			}
			//Otherwise, append data to last slide.
			var current_slide = slides[slides.length-1].slide;
			//TODO: BUG
			//We don't know if the array in slide is a data array 
			// or an array of data arrays (i.e dataset)
			current_slide.push(data);
			
			return App;
		}
	};
	App.options = {
		grid:{x:false, y:false}
	};
	return App;
};

//TODO: remove Elements

},{"./elem":18,"./events":19,"./menu/menu":24,"./modals":29,"./pro/plugins":32,"./slide":35}],23:[function(require,module,exports){
var inp = require('../input_elem');
var utils = require('../utils');

function add_li(sel) {
	sel.enter()
		.append("li")
		.text(function(d){return d.label;})
		.classed('menu-item', true)
		.classed('not1d', function(d){ return d.nd && d.nd.indexOf(1) < 0; })
		.classed('not2d', function(d){ return d.nd && d.nd.indexOf(2) < 0; });
  
	return sel;		
}

function recursive_add(sel){
	var new_sel = sel.filter(function(d){return d.children;})
		.classed('openable', true)
		//.attr('tabindex', 1)
		.append("div").append("ul")
		.selectAll("li")
			.data(function(d){return d.children;})
			.call(add_li);
	
	if(new_sel.filter(function(d){return d.children;}).size() > 0){
		recursive_add(new_sel);
	}
}

function main_menu () {
	var menu_data;
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
			.data(menu_data)
			.call(add_li)
			.call(recursive_add);
			
    nav.selectAll('li')
      .on("click", function(d){
        if(d.fun){
          utils.fireEvent(div.node(), 'click'); //close the menu.
          d.fun();
        }else{
        	this.focus();
        }
      });

	}
	_main.data = function (_) {
		if (!arguments.length) {return menu_data;}
		menu_data = _;
		return _main;
	};
	return _main;
}

module.exports = main_menu;
},{"../input_elem":21,"../utils":36}],24:[function(require,module,exports){
var utils = require('../utils');
var bootstrap = require('../../lib/bootstrap-tooltip').bootstrap;

module.exports = function (app){	
	function toggle(){
	  if(d3.event.target !== this) {return;}
  
	  var button = d3.select(this).toggleClass('opened');
	  button.select('.tooltip')
	    .style('display', button.classed('opened')? 'none': null);
	}
	// Import needed modules for sub-menus
	var main_menu = require('./main_menu')(app),
		spectra = require('./spectra')(app),
		slides = require('./slides')(app),
		menu_data = require('./menu_data')(app),
		serverside_menu = require('./serverside-menu');
	
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
	  .attr('class', function(d){return d[0];})
	  .attr('title', function(d){return d[1];})
	  .call(bootstrap.tooltip().placement('right'))
	  .on('click', toggle);
	
	elem.select('.open-menu').call( main_menu.data(menu_data) ); 
	
	
	var app_dispatcher = app.dispatcher();
	
	
	// Full screen manipulation
	elem.select('.open-fullscreen')
		.on('click', function () {
			utils.fullScreen.toggle(app.node());
			toggle.apply(this);
		});
	
	d3.select(window).on('resize.fullscreenbutton', function () {
		elem.select('.open-fullscreen').classed('opened', utils.fullScreen.isFull() );
	});
	/**************************/
	
	app_dispatcher.on('menuUpdate.menu', function () {
		elem.select('.open-menu').call( main_menu );
	});
	app_dispatcher.on('slideChange.menu', function (s) {
		//TODO: hide parent menu-item when all children are hidden
		var two_d_slide = s.nd === 2;
		elem.select('.open-menu')
			.classed('d1', !two_d_slide)
			.classed('d2', two_d_slide);
		elem.select('.open-spec-legend').call( spectra );
		elem.select('.open-slides').call( slides );
	});
	app_dispatcher.on('slideContentChange.menu', function () {
		elem.select('.open-spec-legend').call( spectra );
	});
	
	serverside_menu(app, menu_data); //read menu from server.
	return elem;									
};

},{"../../lib/bootstrap-tooltip":1,"../utils":36,"./main_menu":23,"./menu_data":25,"./serverside-menu":26,"./slides":27,"./spectra":28}],25:[function(require,module,exports){
var events = require('../events');

function get_menu_data (app) {
	var modals = app.modals();
	return [	
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
	/*	{
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
		},*/
	];	
}


module.exports = get_menu_data;
},{"../events":19}],26:[function(require,module,exports){
module.exports = function (app, menu_data) {
	function find_menu_item (menu, item) {
		for (var i = menu.length - 1; i >= 0; i--) {
			if(menu[i].label === item){
				if(!menu[i].children) {menu[i].children = [];}
				return menu[i];
			}
		}
		menu.push({label:item, children:[]});
		return menu[menu.length-1];
	}
	function plugin_functor (c) {
		if(c["args"]){
			return function() {
				app.modals().methods(c["fun"], c["args"], c["title"])();
			};
		}else{
			return function () { app.pluginRequest (c["fun"]); };
		}
	}
	
	var ajax = require('../pro/ajax');
	ajax.getJSON('/nmr/test', function (response) {
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
		app.dispatcher().menuUpdate();

	});
};



},{"../pro/ajax":30}],27:[function(require,module,exports){
var inp = require('../input_elem');

module.exports = function (app) {
	function _main(div) {		
		div.select('.menu-container').remove();
		
		var nav = div.append(inp.popover('Slides'))
			.classed('menu-container', true)
			.select('.popover-content');
		
		nav.append('ul')
			.classed('block-list slide-list', true)
			.selectAll('li')
			.data(app.slides).enter()
			.append('li')
				.text(function(d,i){return 'Slide ' + (i+1);})
				.on('click', function (d) {
					app.dispatcher().slideChange(d);
				});
				
		return div;
	}
	return _main;
};


},{"../input_elem":21}],28:[function(require,module,exports){
var inp = require('../input_elem');

function spectra (app) {
	function _main(div) {
		
		div.select('.menu-container').remove();
		
		var nav = div.append(inp.popover('Spectra'))
			.classed('menu-container', true)
			.select('.popover-content');
		
		//TODO: SpectrumSelector takes an App
		var spec_selector = inp.spectrumSelector(app);
		
		if( (!app.currentSlide()) || app.currentSlide().spectra().length === 0){
			nav.append(spec_selector);
		}else{
			var spec_list = d3.select( spec_selector() ).select('ul');
			
			nav.append( function () {return spec_list.node();} )
				.classed('block-list spec-list no-checkbox', true);
		}				
		
		return div;
	}
	return _main;
}

module.exports = spectra;
},{"../input_elem":21}],29:[function(require,module,exports){
require('nanoModal');
console.log(require('nanoModal')());
var nanoModal = window.nanoModal;
nanoModal.customHide = function(defaultHide, modalAPI) {
	modalAPI.modal.el.style.display = 'block';
	defaultHide();
};

function app_modals(app){
	var modals = {};
	
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
	
		if(!app){
			console.log('App is not defined. Initialize the modal module first.');
			return;
		}
		//TODO: define spec-app;
		app.append(function () {return nano.overlay.el;});
		app.append(function () {return nano.modal.el;});
	
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
						.style("left", d3.event.sourceEvent.pageX+"px");
				});
			d3.select(nano.modal.el).select(".title").call(drag);
			d3.select(nano.modal.el).select(".cancelBtn").node().focus();
		
			//{display: flex,flex-direction: column}
		});
		return nano;
	};

	modals.error = function (title, message) {
		var nano = modals.proto('Error: ' + title, message);
		d3.select(nano.modal.el)
			.classed('errorModal', true)
			.select('.cancelBtn').text('Dismiss');
		nano.show();
	};

	modals.range = function (text, _range, callback, _curr_val){
		var range;
		if(_range[0]>_range[1]){
			range = [_range[1], _range[0]];
		}else{
			range = _range;
		}
		range = [d3.round(range[0],3), d3.round(range[1],3)];
	
		if(typeof _curr_val === 'undefined'){
			_curr_val = range;
		}else{
			if(_curr_val[0]>_curr_val[1])
				{_curr_val = [_curr_val[1], _curr_val[0]];}
		
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
			
				if (input_range[0] < range[0] || input_range[0] > range[1] ||
					input_range[1] < range[0] || input_range[1] > range[1] ||
					input_range[0] > input_range[1]) {
					nanoModal("Invalid input."+input_range).show();
				}else{
					if(_range[0]>_range[1]){
						callback(input_range.reverse());
					}else{
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
			function () {
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

	modals.methods = function (fun ,args, title, specSelector, has_preview) {
		var el;
		var preview = true;
		
	
		var ok_fun = function (modal) {
			preview = false;
			require('./utils').fireEvent(el.node(), 'input');
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
	      .each(function () {
	        form_data[this.id] = this.getValue();
	      });
		
			if(timer) { clearTimeout(timer); }
				
		
			if(preview === false || 
				d3.event.target === el ||
				form_data['prev_btn'] === true){
				app.pluginRequest(fun, form_data, form_data['s_id'], preview);
			}else	if(form_data['prev_auto'] === true){
				timer = setTimeout(function () {
					app.pluginRequest(fun, form_data, form_data['s_id'], true);
				}, 300);
			}
		});
	
		var inp = require('./input_elem');
		el.append(inp.spectrumSelector(app));
		el.append(inp.div(args, app));
		el.append(inp.preview(true));
		return nano.show;
	};
	
	return modals;
}
//spec.modals = modals;
module.exports = app_modals;
},{"./input_elem":21,"./utils":36,"nanoModal":4}],30:[function(require,module,exports){
//TODO:var modals = spec.modals;
var modals = require('../modals');

var request = function (url, callback, err) {
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

var getJSON = function(url, callback, show_progress){
	var prog = ajaxProgress();
	request(url, function (response) {
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
		request('/nmr/test', function (response) {
			if(!stopped){
				// TODO: Progress should be bound to app
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
		// TODO: Progress should be bound to app
	  d3.select(".progress").text("Completed")
			/*.transition()
	    .duration(2500)
	    .style("opacity", 1e-6)*/
	}
	return run;
};

module.exports.request = request;
module.exports.getJSON = getJSON;

},{"../modals":29}],31:[function(require,module,exports){
function handle_peaks (app, json) {
	var spec = app.currentSlide().spectra().filter(function (s) {
		return s.s_id() === json['s_id'];
	});
	
	if (spec.length === 0){
		app.modals.error('Incompatible server response', 
		'Can\'t find spectrum with s_id:' + json['s_id']);
	}
	spec[0].addPeaks(json['peaks']);
}

function handle_segs (app, json) {
	var spec = app.currentSlide().spectra().filter(function (s) {
		return s.s_id() === json['s_id'];
	});
	
	if (spec.length === 0){
		app.modals.error('Incompatible server response', 
		'Can\'t find spectrum with s_id:' + json['s_id']);
	}
	
	for (var i = 0; i < json['segs'].length; i++) {
		spec[0].addSegmentl( json['segs'][i] );
	}
}


function handle_spec_feature (app, json, preview){
	if (json['peaks'] !== undefined){
		handle_peaks(app, json, preview);
	}
	if (json['segs'] !== undefined){
		handle_segs(app, json, preview);
	}
}

function handle_spectrum (app, json, preview){
	require('./process_data')
		.process_spectrum(json, app.currentSlide().addSpec);
}

module.exports.spectrum = handle_spectrum;
module.exports.spec_feature = handle_spec_feature;
},{"./process_data":33}],32:[function(require,module,exports){
module.exports = function (app) {
	function request (fun, params, s_id, preview) {
		params = params || {};
	
		if(!params['sid']){
			if(s_id){
				params['sid'] = s_id;
			}else{
				var sel = app.currentSlide().spectra(true);
				params['sid'] = sel.map(function (s) { return s.s_id(); });
			}
		}
		if(params['sid'].length === 0)
			{app.modals.error('No Spectra selected', 'Please select one or more spectra!');}
		
		var prefix = fun+'_';
		var params_str = 'sid=' + 
			JSON.stringify(params['sid']) + '&preview=' + (+preview) +'&'+ prefix + '=null';
	
		for(var key in params){
			if(key === 'sid') {continue;}
			if(params_str.length>0) {params_str +='&';}
		
			params_str += prefix + key+'='+params[key];
		}
	
		var url = '/nmr/plugins?'+params_str;
		//var ajax = pro.ajax();
		var ajax = require('./ajax');
		ajax.getJSON(url, function (response) {
				respond(response, preview);
		});
	}
	
	 function respond (json, preview) {
		if (json.constructor === Array) {
			for (var i = json.length - 1; i >= 0; i--) {
				respond(json[i]);
			}
			return;
		}
		var hooks = require('./plugin-hooks');
		
		var type = json['data_type'];
		if (type === undefined){ //if no data_type, it is assumed as spectrum
			type = 'spectrum';
		}
		if(typeof hooks[type] === 'function'){
			hooks[type](app, json, preview);
		}else{
			app.modals.error('Unsupported data-type', 
				'Couldn\'t find suitable function to read "'+type+'" data');
		}
		
	}
	return request;
};

},{"./ajax":30,"./plugin-hooks":31}],33:[function(require,module,exports){
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

var process_xy = function(pre_data, render_fun){
	var data = pre_data.x.map(function(d,i){ return {x:d, y:pre_data.y[i]}; });	
	render_fun(data);
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
			
			require('./worker').addJob({message:worker_message, callback:worker_callback});
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
function process_spectrum (json, render_fun){
	console.log('processing')
	if (json.constructor === Array) {
		for (var i = json.length - 1; i >= 0; i--) {
			process_spectrum(json[i], render_fun);
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
			if (require('./worker').maxWorkers() > 0){
				processPNGworker(json, render_fun);
			}else{
				processPNG(json, render_fun);
			}			
			break;
	}	
}

function get_spectrum (url, render_fun) {
	var ajax = require('./ajax');
	ajax.getJSON(url, function (response) {
		process_spectrum(response, render_fun);
	});
}

module.exports.get_spectrum = get_spectrum;
module.exports.process_spectrum = process_spectrum;
},{"./ajax":30,"./worker":34}],34:[function(require,module,exports){
var workers_pool = [];
var MAX_WORKERS = (navigator.hardwareConcurrency || 2) -1;

function make_png_worker () {
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

var q = [];

function next (worker) {
	var job = q.shift();
	if (!job) // if the queue is finished.
		return;
	
	worker.hasJob = true;
	worker.onmessage = function (e) {
		var callback = job['callback'];
		worker.hasJob = false;
		next(worker);
		callback(e);
	};
	worker.postMessage(job['message'][0], job['message'][1]);
};

function addJob (_) {
	q.push(_);
	var free_worker = getFreeWorker();
	if ( typeof free_worker !== 'undefined'){ //if there is a currently free worker, start this job.
		next(free_worker);
	}
};

function getFreeWorker() {
	for (var i = 0; i < workers_pool.length; i++) {
		if (! workers_pool[i].hasJob){
			return workers_pool[i];
		}
	}
	if (workers_pool.length < MAX_WORKERS){
		var new_worker = make_png_worker();
		workers_pool.push(new_worker);
		return new_worker;
	}
	return undefined;
}

function maxWorkers(_) {
  if (!arguments.length) return MAX_WORKERS;
  MAX_WORKERS = _;
}

module.exports.addJob = addJob;
module.exports.maxWorkers = maxWorkers;
},{}],35:[function(require,module,exports){
module.exports = function(){
	var core = require('./elem');
	var source = core.Elem('g');
	core.inherit(Slide, source);
	
	var data, slide_selection, svg_selection, svg_width, svg_height;
	var clip_id = require('./utils').guid();
	var parent_app, spec_container;
	
	// Event dispatcher to group all listeners in one place.
	var dispatcher = d3.dispatch(
		"rangechange", "regionchange", "regionfull", "redraw",  	//redrawing events
		'specDataChange',
		"mouseenter", "mouseleave", "mousemove", "click", 	//mouse events
		"keyboard",																//Keyboard
		"peakpickEnable", "peakdelEnable", "peakpick", "peakdel",		//Peak picking events
		"integrateEnable", "integrate", "integ_refactor",						//Integration events
		"crosshairEnable",
		"blindregion",
		"log"
	);
	
	
	function Slide(app){
		parent_app = app;
		if(!data){
			//create_empty_slide();//TODO
			return ;
		}
		svg_width = Slide.width();
		svg_height = Slide.height();
		
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
		dispatcher.idx = 0;
		
		svg_selection = app.append('svg')
			.classed('spec-slide', true)
			.attr({
				width:svg_width,
				height:svg_height
			});
			
		slide_selection = source(svg_selection)
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.attr({
				width:svg_width,
				height:svg_height
			});
		
		//var contents = slide_selection
			//.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		
    var defs = slide_selection.append("defs");
		defs.append("clipPath")
		.attr("id", clip_id)
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
			var slope = 1;
			if (require('bowser').safari) {
			  slope *= 2;
			}
			var svg_filter = defs.append("filter").attr("id", "2dColorFilter");
			svg_filter.append("feColorMatrix")
				.attr("type","matrix")
				.attr("values","1 0 0 0 0	0 0 0 0 0 1 0 0 0 0 0 0 0 1 0");
	
			var fe_component_transfer = svg_filter.append("feComponentTransfer")
				.attr("color-interpolation-filters","sRGB");
	
			fe_component_transfer.append("feFuncR")
				.attr("type","linear")
				.attr("slope",-slope)
				.attr("intercept","0.5");
				
			fe_component_transfer.append("feFuncB")
				.attr("type","linear")
				.attr("slope",slope)
				.attr("intercept","-0.5");
	
			fe_component_transfer = svg_filter.append("feComponentTransfer")
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
		slide_selection.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")");
			

		slide_selection.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + width + ",0)");
		
		slide_selection.append("g").classed('x grid', true);
		slide_selection.append("g").classed('y grid', true);
		
		slide_selection.append("text")
	    .attr("class", "x label")
	    .attr("text-anchor", "middle")
	    .attr("x", width/2)
	    .attr("y", height)
			.attr("dy", "2.8em")
	    .text("Chemical shift (ppm)");
		
		slide_selection.append("text")
	    .attr("class", "y label")
	    .attr("text-anchor", "end")
	    .attr("y", width)
	    .attr("dy", "-.75em")
	    .attr("transform", "rotate(-90)")
	    .text("Intensity");
		
		dispatcher.on("redraw.slide", function (e) {
			if(e.x){
				slide_selection.select(".x.axis").call(xAxis);
				if(app.options.grid.x){
					slide_selection.select(".x.grid").call(xGrid);
				}
			}
			if(e.y){
				slide_selection.select(".y.axis").call(yAxis);
				if(app.options.grid.y){
					slide_selection.select(".y.grid").call(yGrid);
				}
			}
		});
		
		spec_container = two_d ? require('./d2/spec-container-2d')() : require('./d1/spec-container-1d')();
		//Spec-Container
		spec_container
			.datum(data)
			.xScale(x)
			.yScale(y)
			.width(width)
			.height(height)
			.dispatcher(dispatcher)
			(Slide);
		
		//Scale brushes
		require('./d1/scale-brush')()
			.xScale(x)
			.dispatcher(dispatcher)
			(Slide);
				
		require('./d1/scale-brush')()
			.yScale(y)
			.dispatcher(dispatcher)
			(Slide);
		
		d3.rebind(Slide, spec_container, 'spectra', 'addSpec', 'changeRegion', 'range');
	}
	Slide.show = function (_) {
		svg_selection.classed('active', _);
	};
	Slide.nd = function(){
		if (!data){ //TODO: empty slide?
			return 0;
		}
		return (data["nd"] && data["nd"] === 2) ? 2 : 1;
	};
	Slide.clipId = function(){
		return clip_id;
	};
	Slide.slideDispatcher = function(){
		return dispatcher;
	};
	Slide.specContainer = function(){
		return spec_container;
	};
  Slide.datum = function(_){
    if (!arguments.length) {return data;}
    data = _;
    return Slide;
  };
	Slide.parent = function () {
		return parent_app;
	};
	return Slide;
};

},{"./d1/scale-brush":12,"./d1/spec-container-1d":13,"./d2/spec-container-2d":16,"./elem":18,"./utils":36,"bowser":2}],36:[function(require,module,exports){
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
var resample = function (data, xscale, tolerance) {
	var ppm_range = Math.abs(xscale.domain()[0] - xscale.domain()[1]);
	var pixels = Math.abs(xscale.range()[0] - xscale.range()[1]);
	ppm_per_pixel = ppm_range / pixels;
	tolerance *= ppm_per_pixel
	
  var dataResample = require('simplify')(data, tolerance);
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

},{"simplify":5}]},{},[20])(20)
});
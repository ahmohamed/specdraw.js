var inp = require('../input_elem');
var utils = require('../utils');

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

function main_menu (app) {
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
		if (!arguments.length) return menu_data;
		menu_data = _;
		return _main;
	}
	return _main;
}

module.exports = main_menu;
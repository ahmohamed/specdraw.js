var utils = require('../utils');

function create_menu (app){	
	function toggle(e){
	  if(d3.event.target !== this) return;
  
	  var button = d3.select(this).toggleClass('opened');
	  button.select('.tooltip')
	    .style('display', button.classed('opened')? 'none': null);
	}
	// Import needed modules for sub-menus
	var main_menu = require('./main_menu')(app),
		spectra = require('./spectra')(app),
		slides = require('./slides')(app),
		menu_data = require('./menu_data')(app);
	
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
	
	elem.select('.open-menu').call( main_menu.data(menu_data) ); 
	
	
	var app_dispatcher = app.dispatcher();
	
	
	// Full screen manipulation
	elem.select('.open-fullscreen')
		.on('click', function (e) {
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
		var two_d_slide = s.nd == 2;
		elem.select('.open-menu')
			.classed('d1', !two_d_slide)
			.classed('d2', two_d_slide);
		elem.select('.open-spec-legend').call( spectra );
		elem.select('.open-slides').call( slides );
	});
	app_dispatcher.on('slideContentChange.menu', function () {
		elem.select('.open-spec-legend').call( spectra );
	});
	
	pro.read_menu(app, menu_data); //read menu from server.
	return elem;									
}

module.exports = create_menu;
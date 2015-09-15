var modals = require('./modals');
var inp = require('./elem');
var events = require('./events');

var create_menu = function(){	
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
		
		elem.select('.open-menu').call(main_menu()); 
		
		
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
			elem.select('.open-menu').call(main_menu());
		});
		app_dispatcher.on('slideChange.menu', function () {
			//TODO: hide parent menu-item when all children are hidden
			var two_d_slide = app.select('.spec-slide.active').node().nd == 2;
			elem.select('.open-menu')
				.classed('d1', !two_d_slide)
				.classed('d2', two_d_slide);
			elem.select('.open-spec-legend').call(spectra());
			elem.select('.open-slides').call(slides());
		});
		app_dispatcher.on('slideContentChange.menu', function () {
			elem.select('.open-spec-legend').call(spectra());
		});
		
		pro.read_menu(app.node(), menu_data); //read menu from server.
		return elem;									
	}
	return _main;
};

var main_menu = function () {
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
			.data(menu_data)
			.call(add_li)
			.call(recursive_add);
			
    nav.selectAll('li')
      .on("click", function(d){
        if(d.fun){
          require('./utils').fireEvent(div.node(), 'click'); //close the menu.
          d.fun();
        }else{
        	this.focus();
        }
      });

	}
	return _main;
};
var spectra = function () {
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
var slides = function () {
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

var menu_data = 
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

module.exports = create_menu;
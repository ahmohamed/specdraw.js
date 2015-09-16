var events = require('../events');

function get_menu_data (app) {
	var modals = app.modals;
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
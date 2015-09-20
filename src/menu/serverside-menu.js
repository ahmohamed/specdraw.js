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



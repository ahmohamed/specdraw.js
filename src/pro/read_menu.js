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
	
	var ajax = pro.ajax();
	//var ajax = require('./pro/ajax');
	ajax.getJSON('/nmr/test', function (response) {
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



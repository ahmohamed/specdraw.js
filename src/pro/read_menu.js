var find_menu_item = function (menu, item) {
	for (var i = menu.length - 1; i >= 0; i--) {
		if(menu[i].label == item){
			return menu[i];
		}
	}
	menu.push({label:item})
	//console.log(menu, item)
	return menu[menu.length-1];
};

var append_menu_item = function(menu, item){
	if ("fun" in item) {
		if("args" in item && item["args"]){
			menu["fun"] = function(){
				spec.method_args(item["fun"] ,item["args"], item["title"])();
			};
		}else{
			menu["fun"] = function () {pro.plugin_funcs (item["fun"])	};			
		}
		return;
	}
	
	if(!menu.children)
		menu.children = [];
			
	for (var k in item) {
		var sub_menu = find_menu_item(menu.children, k);
		append_menu_item(sub_menu, item[k]);
	}
};

pro.read_menu = function (app) {
	ajaxJSONGet('/nmr/test', function (response) {
		for (var k in response) {
			var sub_menu = find_menu_item(spec.menu.menu_data, k);
			append_menu_item(sub_menu, response[k]);
		}
		app.dispatcher.menuUpdate();
	});
};

var find_menu_item2 = function (menu, item) {
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
			spec.method_args(c["fun"], c["args"], c["title"])();
		};
	}else{
		return function () { pro.plugin_funcs (c["fun"]) };
	}
};

pro.read_menu2 = function (app) {
	ajaxJSONGet('/nmr/test', function (response) {
		console.log(spec.menu.menu_data)
		var c = response;
		for (var i = 0; i < response.length; i++) {
			var path = find_menu_item2(spec.menu.menu_data, c[i]['menu_path'][0]);
			
			for (var j = 1; j < c[i]['menu_path'].length; j++) {
				path = find_menu_item2(path.children, c[i]['menu_path'][j]);
			}
			path.children = null;
			path.fun = plugin_functor(c[i]);
			path.nd = c[i]['nd'];			
			
		}		
		console.log(spec.menu.menu_data)
		app.dispatcher.menuUpdate();
		
	});
};


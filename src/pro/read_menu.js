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
			menu["fun"] = spec.method_args(item["fun"] ,item["args"], item["title"])
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

pro.read_menu = function (menu, callback) {
	ajaxJSONGet('/nmr/test', function (response) {
		for (var k in response) {
			var sub_menu = find_menu_item(menu, k);
			append_menu_item(sub_menu, response[k]);
		}
		callback(menu);
	});
};
//pro.read_menu();

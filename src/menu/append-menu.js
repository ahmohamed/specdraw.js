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


module.exports = function (menu, menu_path) {
  var path = find_menu_item(menu, menu_path[0]);

  for (var j = 1; j < menu_path.length; j++) {
    path = find_menu_item(path.children, menu_path[j]);
  }
  return path;
};

// A plugin hook to inject additional menu entries.

var additional_menu = [];


function add_menu(entry) {
  if (entry.constructor === Array) {
    for (var i = 0; i < entry.length; i++) {
      add_menu(entry[i]);
    }
    return;
  }
  if (! entry.menu_path  || entry.fun){
    console.error('menu entry must define menu_path and fun');
  }
  
  additional_menu.push(entry);  
}

function get_menu() {
  return additional_menu;
}

module.exports.get_menu = get_menu;
module.exports.add_menu = add_menu;

var bootstrap = require('../../lib/bootstrap-tooltip').bootstrap;
var ajax = require('../pro/ajax');

function read_menu(app, response) {
  function plugin_functor (c) {
    if(c["args"]){
      return function(app) {
        app.modals().methods(c["fun"], c["args"], c["title"])();
      };
    }else{
      return function (app) { app.pluginRequest (c["fun"]); };
    }
  }
  
  //var c = response;
  for (var i = 0; i < response.length; i++) {
    server_menu.push( {
      menu_path: response[i]['menu_path'],
      nd: response[i]['nd'],
      fun: plugin_functor(response[i])
    });
    
    //response[i]['fun'] = plugin_functor(response[i]);
  }
	//server_menu = response;
  app.dispatcher().menuUpdate();
}




var server_menu;
module.exports = function(app) {
	if (server_menu) {
		return server_menu;
	}
  server_menu = []; //flag that we are getting the menu.
  
  app.select('.connection-status')
    .attr('class', 'connection-status connecting')
    .attr('title', 'Connection status: connecting')
		.on('click', null)
    .call(bootstrap.tooltip().placement('right'));
  
  ajax.getJSON(app.connect() + 'menu', success, fail);
  
  function success(response) {
    app.select('.connection-status')
      .attr('class', 'connection-status connected')
      .attr('title', 'Connection status: connected')
      .call(bootstrap.tooltip().placement('right'));
    read_menu(app, response);
  }
  function fail() {
    server_menu = undefined;
    app.select('.connection-status')
      .attr('class', 'connection-status disconnected')
      .attr('title', 'Disconnected. Click to reconnect.')
			.on('click', function () { module.exports(app);})
      .call(bootstrap.tooltip().placement('right'));
  }
	
	// it returns an empty array until the ajax call returns, and calls dispatcher().menuUpdate()
	return [];
};


var append_menu = require('./append-menu');
var bootstrap = require('../../lib/bootstrap-tooltip').bootstrap;
var ajax = require('../pro/ajax');

function read_menu(app, menu_data, response) {
  function plugin_functor (c) {
    if(c["args"]){
      return function(app) {
        app.modals().methods(c["fun"], c["args"], c["title"])();
      };
    }else{
      return function (app) { app.pluginRequest (c["fun"]); };
    }
  }
  
  var c = response;
  for (var i = 0; i < response.length; i++) {
    var path = append_menu(menu_data, c[i]['menu_path']);
    path.children = null;
    path.fun = plugin_functor(c[i]);
    path.nd = c[i]['nd'];
  }
  app.dispatcher().menuUpdate();
}

module.exports = function(app, menu_data) {
  app.select('.connection-status')
    .attr('class', 'connection-status connecting')
    .attr('title', 'Connection status: connecting')
    .call(bootstrap.tooltip().placement('right'));
  
  ajax.getJSON(app.connect() + 'menu', success, fail);
  
  function success(response) {
    app.select('.connection-status')
      .attr('class', 'connection-status connected')
      .attr('title', 'Connection status: connected')
      .call(bootstrap.tooltip().placement('right'));
    read_menu(app, menu_data, response);
  }
  function fail() {
    app.select('.connection-status')
      .attr('class', 'connection-status disconnected')
      .attr('title', 'Disconnected. Click to reconnect.')
      .call(bootstrap.tooltip().placement('right'));
  }
};


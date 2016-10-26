var fullscreen = require('../utils/fullscreen');
var bootstrap = require('../../lib/bootstrap-tooltip').bootstrap;
var events = require('../events');

module.exports = function (app){  
  function toggle(callback){
    if(d3.event.target !== this) {return;}
  
    var button = d3.select(this).toggleClass('opened');
    var opened = button.classed('opened');
    button.select('.tooltip')
      .style('display', opened ? 'none': null);
    
    if (opened && typeof callback === 'function'){
      button.call(callback);
    }
    return opened;
  }
  // Import needed modules for sub-menus
  var main_menu = require('./main_menu')(app),
    spectra = require('./spectra')(app),
    slides = require('./slides')(app),
    get_menu_data = require('./menu_data');
  
  var column_menu_buttons = [
    ['open-menu', 'Menu'],
    ['open-spec-legend', 'Spectra'],
    ['open-slides', 'Slides'],
    ['kbd', 'Keyboard Shortcuts'],
  ];
  
  // Full client-side only buttons
  if(app.config() > 2){
    column_menu_buttons = column_menu_buttons.concat(
      [//['open-settings', 'Settings'],
        //['open-download', 'Download Spectra'], //TODO: download spectra: csv, peak table, Jcamp?
      ['open-fullscreen', 'Fullscreen App'],
      ['connection-status', 'Connection Status']]
    );
  }
  
  var elem = app.append('div')
    .classed('column-menu', true);
    
  elem.selectAll('div')
    .data(column_menu_buttons).enter()
    .append('div')
    .attr('class', function(d){return d[0];})
    .attr('title', function(d){return d[1];})
    .call(bootstrap.tooltip().placement('right'))
    .on('click', toggle);
  
  elem.select('.open-spec-legend').on('click', function(){
    toggle.apply(this, [spectra]);
  });
  elem.select('.open-slides').on('click', function(){
    toggle.apply(this, [slides]);
  });
  elem.select('.kbd').on('click', function(){
    events.display_shortcuts(app);
  });
  
  var app_dispatcher = app.dispatcher();
  app_dispatcher.on('slideChange.menu', function () {
    elem.select('.open-spec-legend').call( spectra );
    elem.select('.open-slides').call( slides );
    app_dispatcher.menuUpdate();
  });
  
  app_dispatcher.on('slideContentChange.menu', function () {
    elem.select('.open-spec-legend').call( spectra );
  });
  
  app_dispatcher.on('menuUpdate.menu', function () {
    elem.select('.open-menu').call( main_menu.data(get_menu_data(app)) );
  });
  
  //initialize main-menu
  elem.select('.open-menu').call( main_menu.data(get_menu_data(app)) );
  
  if(app.config() < 3){ return elem; }
  
  /*******   Full client-side only  ***********/
  // Full screen manipulation
  elem.select('.open-fullscreen')
    .on('click', function () {
      fullscreen.toggle(app.node());
      toggle.apply(this);
    });
  
  d3.select(window).on('resize.fullscreenbutton', function () {
    elem.select('.open-fullscreen').classed('opened', fullscreen.isFull() );
  });
  /******************************************/
  return elem;                  
};

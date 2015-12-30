var events = {
  crosshair:true,
  peakpick:false,
  peakdel:false,
  integrate:false,
  zoom:["x", "y", false]
};

var shortcuts = [];
events.crosshairToggle = function (app) {
  events.crosshair = !events.crosshair;
  app.slideDispatcher().crosshairEnable(events.crosshair);
};

events.peakpickToggle = function (app) {
  if(events.zoom[0] !== false)  events.zoom.rotateTo(false);  
  if(events.peakdel !== false)  events.peakdelToggle(app);
  if(events.integrate !== false)  events.integrateToggle(app);
  
  events.peakpick = !events.peakpick;
  app.slideDispatcher().peakpickEnable(events.peakpick);
}

events.peakdelToggle = function (app) {
  if(events.zoom[0] !== false)  events.zoom.rotateTo(false);  
  if(events.peakpick !== false)  events.peakpickToggle(app);
  if(events.integrate !== false)  events.integrateToggle(app);  
  
  events.peakdel = !events.peakdel;
  app.slideDispatcher().peakdelEnable(events.peakdel);  
}

events.integrateToggle = function (app) {
  if(events.zoom[0] !== false)  events.zoom.rotateTo(false);  
  if(events.peakpick !== false)  events.peakpickToggle(app);
  if(events.peakdel !== false) events.peakdelToggle(app);

  events.integrate = !events.integrate;
  app.slideDispatcher().integrateEnable(events.integrate);  
}

events.zoomToggle = function (app) {
  if(events.peakpick !== false)  events.peakpickToggle(app);
  if(events.peakdel !== false)  events.peakdelToggle(app);
  if(events.integrate !== false)  events.integrateToggle(app);  
  
  events.zoom.rotate();
  //dispatcher.integrateEnable(events.integrate);  
}

function add_kbd_shortcut(shortcut, fun, message) {
  shortcut = shortcut.toUpperCase()
  var all_keys = shortcut.split(' ');
  var key = all_keys[all_keys.length - 1];
  var shift = shortcut.indexOf('SHIFT') > -1;
  var ctrl = shortcut.indexOf('CONTROL') > -1 || shortcut.indexOf('CTRL') > -1;
  var alt = shortcut.indexOf('ALT') > -1;
  shortcuts.push({key:[key, shift, ctrl, alt], fun:fun, message: message});
}

function shortcut_to_text(s) {
  ret = '';
  if(s[1]) ret +='⇧';
  if(s[2]) ret +='Ctrl';
  if(s[3]) ret +='⌥';
  
  if(s[0]) ret += s[0];
  console.log(s, ret);
  return ret
}
events.display_shortcuts = function(app) {
  var nano = app.modals().proto('Keyboard Shortcuts', '', 'hide');
  el = d3.select(nano.modal.el).select(".nanoModalContent")//.style('display', 'table');
  el.append('table').selectAll('tr')
    .data(shortcuts).enter()
    .append('tr')
    .each(function (d,i) {
      var _this = d3.select(this)
      _this.append('td').append('kbd').text(shortcut_to_text(d.key));
      _this.append('td').text(d.message)
    });
  
  nano.show();
};

events.registerKeyboard = function(app){
  add_kbd_shortcut('?', events.display_shortcuts, 'Display help and keyboard shortcuts');
  add_kbd_shortcut('c', events.crosshairToggle, 'Toggle crosshair');
  add_kbd_shortcut('z', events.zoomToggle, 'Toggle zoom');
  add_kbd_shortcut('f', function(app){app.slideDispatcher().regionfull(app)}, 'View full spectrum');
  add_kbd_shortcut('shift', null, 'Move cursor to nearest peak maximum');
  
  if(app.config() > 2){
    add_kbd_shortcut('p', events.peakpickToggle, 'Peak picking');
    add_kbd_shortcut('d', events.peakdelToggle, 'Peak deletion');
    add_kbd_shortcut('i', events.integrateToggle, 'Peak integration');
  }
  
  // Add keyboard listener
  d3.select("body").on("keypress", function() {
    //app.slideDispatcher().log("keyCode: " + d3.event.keyCode);
    var pressed = String.fromCharCode(d3.event.keyCode).toUpperCase()
    for (var i = 0; i < shortcuts.length; i++) {
      var k = shortcuts[i].key;
      if(k[0] != pressed || 
        (k[1] && !d3.event.shiftKey) ||
        (k[2] && !d3.event.ctrlKey) ||
        (k[3] && !d3.event.altKey)){
          continue;
        }else{
          shortcuts[i].fun(app);
          break;
        }
    }
    //fall back if nothing matched the shortcut
    app.slideDispatcher().keyboard(d3.event);
  });    
};
module.exports = events;
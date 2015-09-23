var events = {
  crosshair:true,
  peakpick:false,
  peakdel:false,
  integrate:false,
  zoom:["x", "y", false]
};

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

events.registerKeyboard = function(app){
  d3.select("body").on("keydown", function() {
    app.slideDispatcher().log("keyCode: " + d3.event.keyCode);
  
    if(app.config() > 2){
      if (d3.event.keyCode===80) { // p
        events.peakpickToggle(app);
      }else if (d3.event.keyCode===68) { // d
        events.peakdelToggle(app);
      }else if (d3.event.keyCode===73) { // i
        events.integrateToggle(app);
      }
    }
    
    if (d3.event.keyCode===67) { // c
      events.crosshairToggle(app);
    }else if (d3.event.keyCode===70) { // f
      dispatcher.regionfull(app);
    }else if (d3.event.keyCode===90) { // z
      events.zoomToggle(app);
    }
    
    app.slideDispatcher().keyboard(d3.event);
  });
};
module.exports = events;
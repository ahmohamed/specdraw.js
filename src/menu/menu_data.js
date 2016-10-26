var events = require('../events');
var append_menu = require('./append-menu');
var server_menu = require('./serverside-menu');

function saveSVG(slide, filename) {
  slide.selectAll('text').attr('font-size', '10px');
  require('save-svg-as-png').svgAsDataUri (slide.node().parentNode, {}, function(uri) {
    var a = document.createElement("a");
    a.download = filename;
    a.href = uri;
    a.setAttribute("data-downloadurl", uri);
    a.click();    
  });  
}

function savePNG(slide, filename) {
  slide.selectAll('text').attr('font-size', '10px');
  require('save-svg-as-png').saveSvgAsPng(slide.node().parentNode, filename);
}

function add_item(i, menu_data){
  var path = append_menu(menu_data, i['menu_path']);
  path.children = null;
  path.fun = i['fun'];
  path.nd = i['nd'];
}
var config2 = [{ menu_path:['View', 'Change region', 'Set X region'],
    fun: function (app){app.modals().xRegion();},
    nd: [1,2]
  },
  { menu_path:['View', 'Change region', 'Set Y region'],
    fun: function (app){app.modals().yRegion();},
    nd: [1,2]
  },
  { menu_path:['View', 'Change region', 'Full spectrum'],
    fun: function (app){app.slideDispatcher().regionfull();},
    nd: [1,2]
  },
  { menu_path:['View', 'Show/hide crosshair'],
    fun: events.crosshairToggle,
    nd: [1,2]
  }];

var config3 = [{ menu_path:['Analysis', 'Peak Picking', 'Manual peak picking'],
    fun: events.peakpickToggle,  nd: [1]
  },
  { menu_path:['Analysis', 'Peak Picking', 'Delete peaks'],
    fun: events.peakdelToggle,  nd: [1]
  },
  { menu_path:['Analysis', 'Peak integration'],
    fun: events.integrateToggle,  nd: [1]
  },
/*TODO  { menu_path:['View', 'Scale selected spectra'],
    fun: function (app){app.modals().scaleLine();},
    nd: [1]
  },*/
  { menu_path:['Save Slide', 'As PNG image'],
    fun: function (app){savePNG(app.currentSlide(), 'specdraw_slide.png');},
    nd: [1,2]
  },
  { menu_path:['Save Slide', 'As SVG image'],
    fun: function (app){saveSVG(app.currentSlide(), 'specdraw_slide.svg');},
    nd: [1,2]
  },
  { menu_path:['Bin Spectra'],
    fun: function (app){
      app.modals().input("Bin size", 0.04, 
      function (input) {
        var bin = require('../d1/binning');
        var specs = app.currentSlide().spectra(true);
        for (var i = 0; i < specs.length; i++) {
          bin(specs[i], +input);
        }
      })();
    },
    nd: [1]
  } ];  

module.exports = function (app) {
  
  var entries = config2;
  if(app.config() > 2){
    entries = entries.concat(config3);
  }
  if(app.config() > 3){
    entries = server_menu(app).concat(entries);
  }
  
  if (app.currentSlide() && app.currentSlide().nd()) {
    var current_nd = app.currentSlide().nd();
    entries = entries.filter(function (e) {
      return !(e.nd && e.nd.indexOf(current_nd) < 0);
    });    
  }
  
  var menu_data = [];
  for (var i = 0; i < entries.length; i++) {
    add_item(entries[i], menu_data);
  }
  return menu_data;
};


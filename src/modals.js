require('nanoModal')
var nanoModal = window.nanoModal;
nanoModal.customHide = function(defaultHide, modalAPI) {
  modalAPI.modal.el.style.display = 'block';
  defaultHide();
};

function app_modals(app){
  var modals = {};
  
  modals.proto = function (title, content, ok_fun, cancel_fun) {  
    var nano = nanoModal(
      '',
      {
      overlayClose: false,
      autoRemove:true,
      buttons: [
        {
          text: "OK",
          handler: ok_fun,
          primary: true
        }, 
        {
          text: "Cancel",
          handler: cancel_fun || "hide",
          classes:"cancelBtn"
        }
      ]}
    );
  
    if(!app){
      app = d3.select('.spec-app');
    }
    //TODO: define spec-app;
    app.append(function () {return nano.overlay.el;});
    app.append(function () {return nano.modal.el;});
  
    var el = d3.select(nano.modal.el);
    
    el.select(".nanoModalContent").html(content || '');
    el.insert("div", ":first-child")
      .classed('title', true)
      .text( title? title : "Dialogue" );
  
    // Disable keyboard shortcuts.
    el.on('keyup', function () {
      if (d3.event.keyCode===27) { // Escape
        console.log('esc');
        nano.hide();
      }
      d3.event.stopPropagation();
    });
    el.on('keypress', function () {
      d3.event.stopPropagation();
    });
    
  
    nano.onShow(function () {
      el.style({
        'display': 'flex',
        'flex-direction': 'column',
        'margin-left': -el.node().clientWidth /2,
        'max-width': 0.8 * el.node().parentNode.clientWidth,
        'max-height': 0.8 * el.node().parentNode.clientHeight
      });
      var drag = d3.behavior.drag()
        .on("drag", function () {
          el.style("top", d3.event.sourceEvent.pageY+"px")
            .style("left", d3.event.sourceEvent.pageX+"px");
        });
      d3.select(nano.modal.el).select(".title").call(drag);
      d3.select(nano.modal.el).select(".cancelBtn").node().focus();
    
      //{display: flex,flex-direction: column}
    });
    return nano;
  };

  modals.error = function (title, message) {
    var nano = modals.proto('Error: ' + title, message);
    d3.select(nano.modal.el)
      .classed('errorModal', true)
      .select('.cancelBtn').text('Dismiss');
    nano.show();
  };

  modals.range = function (text, _range, callback, _curr_val){
    var range;
    if(_range[0]>_range[1]){
      range = [_range[1], _range[0]];
    }else{
      range = _range;
    }
    range = [d3.round(range[0],3), d3.round(range[1],3)];
  
    if(typeof _curr_val === 'undefined'){
      _curr_val = range;
    }else{
      if(_curr_val[0]>_curr_val[1])
        {_curr_val = [_curr_val[1], _curr_val[0]];}
    
      _curr_val = [d3.round(_curr_val[0],3), d3.round(_curr_val[1],3)];
    }
  
    var content = text +
      '<input type="number" id="range0" step="0.001" value='+_curr_val[0]+ ' min='+ range[0] + ' max='+ range[1] +'>' +
      ' - ' +
      '<input type="number" id="range1" step="0.001" value='+_curr_val[1]+ ' min='+ range[0] + ' max='+ range[1] +'>';
    
    var nano = modals.proto("Range", content,
      function(modal) {
        modal.hide();
        var input_range = d3.select(modal.modal.el)
          .selectAll("input")[0].map(function(e){ return +e.value; });
      
        if (input_range[0] < range[0] || input_range[0] > range[1] ||
          input_range[1] < range[0] || input_range[1] > range[1] ||
          input_range[0] > input_range[1]) {
          nanoModal("Invalid input."+input_range).show();
        }else{
          if(_range[0]>_range[1]){
            callback(input_range.reverse());
          }else{
            callback(input_range);
          }
        }
      });
  
    return nano.show;  
  };

  modals.input = function (text, value, callback){  
    var content = text +
      '<input type="number" id="input0" step="0.001" value='+value+'>';
    
    var nano = modals.proto("Numeric", content,
      function(modal) {
        modal.hide();
        var input = d3.select(modal.modal.el)
          .select("input").node().value;
        callback(input);
      });
  
    return nano.show;  
  };

  modals.xRegion = function () {
    modals.range(
      "Set x region to:<br>",
      app.currentSlide().range().x,
      function (new_range) { app.currentSlide().changeRegion({xdomain:new_range}); },
      app.currentSlide().specContainer().xScale().domain()
    )();
  };

  modals.yRegion = function () {
    modals.range(
      "Set y region to:\n",
      app.currentSlide().range().y,
      function (new_range) { app.currentSlide().changeRegion({ydomain:new_range}); },
      app.currentSlide().specContainer().yScale().domain()
    )();
  };

  modals.slider = function (text, value, callback){  
    var content = text +
      '<input id="slider" type="range" min="-5" max="5" value="0" step="0.001"/>';
    
    var nano = modals.proto("Slider", content,
      function(modal) {
        modal.hide();
      },
      function () {
        callback(0);
      });
  
    d3.select(nano.modal.el).select("#slider")
      .on("input", function(){
        callback(+this.value);
      });
  
    return nano.show;  
  };

  modals.scaleLine = function () {
    modals.slider(
      "Scale spectrum by a factor:",
      0,function (value) {
        app.currentSlide().spectra(true)
          .forEach(function (s) {
            s.setScaleFactor(Math.pow(2,value));
          });
      }  
    )();
  };

  modals.methods = function (fun ,args, title, specSelector, has_preview) {
    var el;
    var preview = true;
    
  
    var ok_fun = function (modal) {
      preview = false;
      require('./utils/event')(el.node(), 'input');
      modal.hide();
    };
  
    var nano = modals.proto(title, '',  ok_fun);
    el = d3.select(nano.modal.el).select(".nanoModalContent");
  
  
    var timer = null;
    el.on('input', function () {
      var form_data = {};
      el.selectAll('.param')
        .filter(function () {
          return this.id !== '';
        })
        .each(function () {
          form_data[this.id] = this.getValue();
        });
    
      if(timer) { clearTimeout(timer); }
        
    
      if(preview === false || 
        d3.event.target === el ||
        form_data['prev_btn'] === true){
        app.pluginRequest(fun, form_data, form_data['sid'], preview);
      }else  if(form_data['prev_auto'] === true){
        timer = setTimeout(function () {
          app.pluginRequest(fun, form_data, form_data['sid'], true);
        }, 300);
      }
    });
  
    var inp = require('./input_elem');
    el.append(inp.spectrumSelector(app));
    el.append(inp.div(args, app));
    //el.append(inp.preview(true));
    return nano.show;
  };
  
  return modals;
}
//spec.modals = modals;
module.exports = app_modals;
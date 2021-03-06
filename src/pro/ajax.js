//TODO:var modals = spec.modals;
var modals = require('../modals')();

var request = function (url, callback, err) {
  var http_request = new XMLHttpRequest();
  http_request.open("GET", url, true);
  http_request.onreadystatechange = function () {
    var done = 4;
    var ok = 200;
    if (http_request.readyState === done && http_request.status === ok){
      if(typeof(callback) === 'function')
        {callback(http_request.responseText);}
    }else  if (http_request.readyState === done){
      err(http_request.responseText);
    }
  };
  http_request.send();  
};

var getJSON = function(url, callback, err_fun, show_progress){
  var prog = ajaxProgress();
  if (typeof err_fun !== 'function'){
    err_fun = modals.error;
  }
  request(url, function (response) {
    prog.stop();
    var json;
    try {
      json = JSON.parse(response);
    } catch (e) {
      json = response.toString();
    }
    if(typeof json['error'] === 'undefined'){
      callback(json);
    }else{
      err_fun(json['error']['name'], json['error']['message']);
    }

  },
  function (error) {
    prog.stop();
    err_fun('Network Error', error);
  });

  if(show_progress)
    {prog();}
};

var ajaxProgress = function () {
  var interval, stopped=false;
  function check () {
    request('/nmr/test', function (response) {
      if(!stopped){
        // TODO: Progress should be bound to app
        d3.select(".progress").text(response);
        setTimeout(check, 100);
      }else{
        request('/nmr/test?complete=1');
      }
    });
  }

  var run = function() {
    check();
  };

  run.stop = function() {
    clearInterval(interval);
    stopped = true;
    // TODO: Progress should be bound to app
    d3.select(".progress").text("Completed");
      /*.transition()
      .duration(2500)
      .style("opacity", 1e-6)*/
  };
  return run;
};

module.exports.request = request;
module.exports.getJSON = getJSON;

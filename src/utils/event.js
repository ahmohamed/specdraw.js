module.exports = function(element,event){
  var evt;
  if (document.createEventObject){
    // dispatch for IE
    evt = document.createEventObject();
    return element.fireEvent('on'+event,evt);
  }else{
    // dispatch for firefox + others
    evt = document.createEvent("HTMLEvents");
    evt.initEvent(event, true, true ); // event type,bubbling,cancelable
    return !element.dispatchEvent(evt);
  }
};

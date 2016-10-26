function launchFullScreen(element) {
  if (element.requestFullscreen)
    { element.requestFullscreen(); }
  else if (element.mozRequestFullScreen)
    { element.mozRequestFullScreen(); }
  else if (element.webkitRequestFullscreen)
    { element.webkitRequestFullscreen(); }
  else if (element.msRequestFullscreen)
    { element.msRequestFullscreen(); }
}
function isFullScreen(){
 return document.fullscreenElement ||
  document.mozFullScreenElement ||
  document.webkitFullscreenElement ||
  document.msFullscreenElement;
}
function toggleFullScreen(element) {
  if (!isFullScreen() ) {  // current working methods
    launchFullScreen(element);
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

module.exports.launch = launchFullScreen;
module.exports.toggle = toggleFullScreen;
module.exports.isFull = isFullScreen;

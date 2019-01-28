function isFullscreenForNoScroll() {
  let explorer = window.navigator.userAgent.toLowerCase();
  if (explorer.indexOf('chrome') > 0) {//webkit
    if (document.body.scrollHeight === window.screen.height && document.body.scrollWidth === window.screen.width) {
      return true
    } else {
      return false
    }
  } else {//IE 9+  fireFox
    if (window.outerHeight === window.screen.height && window.outerWidth === window.screen.width) {
      return true
    } else {
      return false
    }
  }
}

function isFullscreen() {
  return document.fullscreenElement ||
    document.msFullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement || false;
}

export default {
  isFullscreenForNoScroll,
  isFullscreen,
}

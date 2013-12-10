
function onDeviceReady() {
  if (parseFloat(window.device.version) === 7.0) {
     document.body.style.marginTop = "20px";
  }
}

document.addEventListener('deviceready', onDeviceReady, false);

var Init = (function() {
    
    var that = {};
   
   /**
    * Method for invoking functions once the DOM and the device are ready. 
    * This is a replacement function for the JQuery provided method i.e.
    * $(document).ready(...).
    */
    that.invokeOnReady = function ( callback ) {

        // Wait for the device ready event only if the the application is running
        // on a mobile browser embedded in a Cordova deployment.
        if ( DeviceDetection.isOnDevice() && DeviceDetection.isNativeApplication() ) {
            document.addEventListener("deviceready", callback, false);
        } else if ( callback && typeof( callback ) === 'function' ) {
            callback();
        }
            

    }
    
    return that;
   
})();
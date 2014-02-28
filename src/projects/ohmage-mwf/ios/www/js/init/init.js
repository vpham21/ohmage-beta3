var Init = (function() {

    var that = {};

   /**
    * Method for invoking functions once the DOM and the device are ready.
    * This is a replacement function for the JQuery provided method i.e.
    * $(document).ready(...).
    */
    that.invokeOnReady = function ( callback ) {
        $(document).ready(function() {
            if (DeviceDetection.isDeviceiOS7()) {
                document.body.style.marginTop = "20px";
            }
            /**
             * The presence of this event handler disables previous page DOM
             * caching in some browsers - see issue #189 on GitHub for more
             * details.
             */
            window.onunload = function () {
                console.log("Init: onunload invoked.");
            };

            window.onpageshow = function (event) {
                if (event.persisted) {
                    window.location.reload()
                }
            };

            //Wait for the device ready event only if the the application is running
            //on a mobile browser embedded in a Cordova deployment.
            if ( DeviceDetection.isOnDevice() && DeviceDetection.isNativeApplication() ) {
                document.addEventListener("deviceready", callback, false);

            } else if ( callback && typeof( callback ) === 'function' ) {
                callback();
            }

        });
    }

    return that;

})();
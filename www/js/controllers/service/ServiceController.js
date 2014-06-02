var ServiceController = (function () {
    "use strict";
    var that = {};

    /**
     * Invokes the method 'fun' if it is a valid function. In case the function
     * method is null, or undefined then the error will be silently ignored.
     *
     * @param fun  the name of the function to be invoked.
     * @param args the arguments to pass to the callback function.
     */
    var invoke = function (fun, args) {
        if (fun && typeof fun === 'function') {
            fun(args);
        }
    };

    var onSuccess = function (onSuccessCallback, onErrorCallback, url, redirectOnAuthError) {

        return function (response) {

            console.log("Received response for URL (" + url + ") with the following response data: " + JSON.stringify(response));
            var i;
            switch (response.result) {
            case 'success':
                invoke(onSuccessCallback, response);
                break;

            case 'failure':
                invoke(onErrorCallback, response);

                //If the API request failed because of authentication related
                //error, then redirect the user to the authentication page.
                if (redirectOnAuthError) {
                    for (i = 0; i < response.errors.length; i += 1) {
                        if (response.errors[i].code === '0200') {
                            if (DeviceDetection.isNativeApplication()) {
                                AuthenticationModel.setAuthErrorState(true);
                            }
                            PageController.openAuth();
                            break;
                        }
                    }
                }

                break;

            default:
                invoke(onSuccess, response);
                break;
            }
        };
    };

    var onError = function (onErrorCallback, url) {
        return function () {
            invoke(onErrorCallback, false);
        };
    };

    /**
     * The method is the primary point of interaction with the Ohmage API.
     *
     * On API call response, the method will analyze the contents of the response
     * and depending on the contents will either invoke onSuccess or onError
     * callbacks.
     *
     * URL argument is the relative path for the API URL. Ohmage server path will be
     * augmented prior to AJAX calls.
     *
     * @param type      The AJAX call type i.e. POST/GET/DELETE.
     * @param url       The API URL extension i.e. /app/survey/upload.
     * @param data      The data sent with the AJAX call.
     * @param dataType  The data type for the AJAX call i.e. XML, JSON, JSONP.
     * @param onSuccessCallback The callback on API call success.
     * @param onErrorCallback   The callback on API call error.
     * @param redirectOnAuthError
     */
    that.serviceCall = function (type, url, data, dataType, onSuccessCallback, onErrorCallback, redirectOnAuthError) {

        //By default, redirect the user to the login page on authentication error.
        redirectOnAuthError = (redirectOnAuthError === undefined) ? true : redirectOnAuthError;


        if (AuthenticationModel.isUserAuthenticated()) {

            if (!data.password && !data.auth_token) {
                if (AuthenticationModel.isUserAuthenticatedByToken()) {
                    data.auth_token = AuthenticationModel.getAuthToken();
                } else {
                    data.user = AuthenticationModel.getUsername();
                    data.password = AuthenticationModel.getHashedPassword();
                }
            }
        }

        if (!data.client) {
            data.client = ConfigManager.getClientName();
        }

        that.ajaxRequest({
            type     : type,
            url      : ConfigManager.getServerEndpoint() + url,
            data     : data,
            dataType : dataType,
            success  : onSuccess(onSuccessCallback, onErrorCallback, url, redirectOnAuthError),
            error    : onError(onErrorCallback, url)
        });

    };

    /**
     * This method should be used for all purposes of AJAX communication. This
     * approach is necessary since although currently the application uses
     * JQuery AJAX library for making requests, this is not always guaranteed to
     * be the case.
     *
     * @param request See JQuery $.ajax(request) documentation.
     */
    that.ajaxRequest = function (request) {
        $.ajax(request);
    };

    return that;


}());
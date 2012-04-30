
/**
 * The server is designed to be as stateless as possible. Since the server does
 * not keep session IDs, authentication information must be sent with each call
 * to the server. The server has two authentication URLs, one which is
 * completely stateless and one which uses a temporary authentication token that
 * is stored on the server. The stateless authentication should be used when the
 * client wants to be permanently logged in, and the other should be used for
 * less secure environments (such as web browsers).
 *
 * @author Zorayr Khalapyan
 */
function UserAuthentication() {

    var me = this;

    /**
     * Endpoint for user authentication via authentication token.
     */
    var TOKEN_AUTH_URL = '/app/user/auth_token';

    /**
     * Authentication token cookie name.
     */
    var TOKEN_AUTH_COOKIE_NAME = 'auth_token';

    /**
     * Endpoint for user authentication via hash password.
     */
    var HASH_AUTH_URL = '/app/user/auth';

    /**
     * Hash authentication cookie name.
     */
    var HASH_AUTH_COOKIE_NAME = 'hashed_password';

    /**
     * The name of the cookie that stores usernames.
     */
    var USERNAME_COOKIE_NAME = 'username';

    var AUTH_ERROR_STATE_COOKIE_NAME = 'auth-error';

    /**
     * Return true if cookie with the specified name exists. Optionally,
     * redirects the user to the provided redirect URL in case the user is
     * authenticated.
     *
     * The method is used for encapsulating common behavior between checking
     * user authentication in both token and hash methods. The authentication
     * cookie is usually either 'auth-token' or 'hashed-password'.
     *
     * @param authCookieName The name of the authentication cookie to check.
     *
     */
    var authenticationCheck = function(authCookieName, redirectURL){

        if(me.isInAuthErrorState()){
            return false;
        }

        if($.cookie(authCookieName) !== null){

            PageNavigation.redirect(redirectURL);

            return true;

        }else{
            return false;
        }
    };

    this.isUserLocked = function(){
        return this.getUsername() != null;
    }

    this.setAuthErrorState = function(state){
        $.cookie(AUTH_ERROR_STATE_COOKIE_NAME, state);
    };

    this.isInAuthErrorState = function(){
        return ($.cookie(AUTH_ERROR_STATE_COOKIE_NAME) == 'true')? true : false;
    }

    /**
     * Returns the authentication token if it exists, or null otherwise.
     * @return The authentication token if it exists, or null otherwise.
     */
    this.getAuthToken = function(){
        return $.cookie(TOKEN_AUTH_COOKIE_NAME);
    }

    /**
     * Returns the hashed password if it exists, or null otherwise.
     * @return The hashed password if it exists, or null otherwise.
     */
    this.getHashedPassword = function(){
        return $.cookie(HASH_AUTH_COOKIE_NAME);
    }

    /**
     * Logs out the currently logged in user. This method is authentication
     * method agnostic and works with both hashed and token authentication
     * methods.
     *
     * @param redirectURL If specified, the logged out user will be redirected
     *        to this URL. This variable is optional.
     */
    this.logout = function(redirectURL){

        //Erase any authentication related cookies.
        $.cookie(TOKEN_AUTH_COOKIE_NAME, null);
        $.cookie(HASH_AUTH_COOKIE_NAME, null);
        $.cookie(USERNAME_COOKIE_NAME, null);
        $.cookie(AUTH_ERROR_STATE_COOKIE_NAME, null);

        window.localStorage.clear();

        PageNavigation.redirect(redirectURL);



    };

    this.checkpoint = function(){
        if(!this.isUserAuthenticated()){
            PageNavigation.redirect('auth.html');
        }
    };

    /**
     * Method agnostic authentication check - this method will return true if
     * the user is either authentication via the hashed password method or via
     * the authentication token method.
     *
     * @param redirectURL If specified, authenticaated users will be redirected
     *        to this URL.
     */
    this.isUserAuthenticated = function(redirectURL){

        if(this.isUserAuthenticatedByHash() ||
           this.isUserAuthenticatedByToken()){

           PageNavigation.redirect(redirectURL);

           return true;

        }

        return false;
    };

    /**
     * Checks if the user is authorized via password hash. If an optional
     * redirect URL is specified, then an authenticated user will be redirected
     * to that URL.
     *
     * @param redirectURL The URL to redirct the user if the user is
     *        authenticated.
     *
     * @return True if the user is authenticated, false otherwise.
     */
    this.isUserAuthenticatedByHash = function(redirectURL){
        return authenticationCheck(HASH_AUTH_COOKIE_NAME, redirectURL);
    };

    /**
     * Checks if the user is authenticated via auth token method. If an optional
     * redirect URL is specified, then an authenticated user will be redirected
     * to that URL.
     *
     * @param redirectURL The URL to redirct the user if the user is
     *        authenticated.
     *
     * @return True if the user is authenticated, false otherwise.
     */
    this.isUserAuthenticatedByToken = function(redirectURL){
        return authenticationCheck(TOKEN_AUTH_COOKIE_NAME, redirectURL);
    };

    /**
     * Returns currently logged in user's username, or null if non exists.
     * @return Currently logged in user's username, or null if non exists.
     */
    this.getUsername = function(){
        return $.cookie(USERNAME_COOKIE_NAME);
    }

    /**
     * Checks if the user is authenticated via the hashed password method. If
     * the authentication was successful, then the callback method will be
     * invoked with a single boolean argument true, otherwise callback will be
     * invoked with arguments (false, error explanation).
     *
     * @param username User's username.
     * @param password User's password.
     * @param callback Invoked on authentication check.
     */
    this.authenticateByHash = function(username, password, callback){

        if(this.isUserAuthenticatedByHash()){
            callback(true);
        }

        //On successful authentication, save the hashed password in a cookie and
        //then invoke the callback.
        var onSuccess = function(response){

            //Save the hashed password in a cookie.
            $.cookie(HASH_AUTH_COOKIE_NAME, response.hashed_password);
            $.cookie(USERNAME_COOKIE_NAME, username);

            me.setAuthErrorState(false);

            callback(true);
        };

        var onError = function(response){
            callback(false, (response) ? response.errors[0].text : null);
        };


       //Make an API call.
       api(
           "POST",
           HASH_AUTH_URL,
           {
                user : username,
                password: password,
                client: '1'
           },
           'JSON',
           onSuccess,
           onError
         );

    };

    /**
     * Checks if the user is authenticated via the auth token method. If
     * the authentication was successful, then the callback method will be
     * invoked with a single boolean argument true, otherwise callback will be
     * invoked with arguments (false, error explanation).
     *
     * @param username User's username.
     * @param password User's password.
     * @param callback Invoked on authentication check.
     */
    this.authenticateByToken = function(username, password, callback)
    {
        if(this.isUserAuthorizedByToken()){
            callback(true);
        }

        //On successful authentication, save the token in a cookie and the
        //invoke the callback.
        var onSuccess = function(response){
            //Save the authentication token in a cookie and invoke the callback.
            $.cookie(TOKEN_AUTH_COOKIE_NAME, response.token);
            $.cookie(USERNAME_COOKIE_NAME, username);

            me.setAuthErrorState(false);

            callback(true);
        };

        var onError = function(response){
            callback(false, (response) ? response.errors[0].text : null);
        };

        //Make an API call.
        api(
           "POST",
           TOKEN_AUTH_URL,
           {
                user : username,
                password: password,
                client: '1'
           },
           'JSON',
           onSuccess,
           onError
         );

    };
}


var auth = new UserAuthentication ();

if(typeof(checkpoint) != 'undefined'){
    auth.checkpoint();
}
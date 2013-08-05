
Init.invokeOnReady( function() {

    if( auth.isUserLocked() ) {

        //If the user is in a locked state, force the username field to
        //be read only.
        $("#username").val(auth.getUsername())
                      .attr('readonly', true);


        mwf.decorator.TopButton("Switch User", null, function(){
            if(auth.logout()){

                $("#username").val("")
                              .attr('readonly', false);

                mwf.decorator.TopButton.remove();
            }
        }, true);
    }

    var isInputValid = function(){

        if($('#username').val().length == 0 && $('#password').val().length == 0){
            MessageDialogController.showMessage('Please enter your username and password.', function(){
                $('#username').focus();
            });

            return false;
        }

        if($('#username').val().length == 0){
            MessageDialogController.showMessage('Please enter your username.', function(){
                $('#username').focus();
            });

            return false;
        }

        if($('#password').val().length == 0){
            MessageDialogController.showMessage('Please enter your password.', function(){
                $('#password').focus();
            });

            return false;
        }

        return true;

    };

    var login = function(){
        if(!isInputValid()){
            return;
        }

        var username = $("#username").val();
        var password = $("#password").val();

        Spinner.show();

        //On successful authentication, redirects the user to the dashboard.
        auth.authenticateByHash(username, password, function(success, response, code){

           Spinner.hide(function(){
               if(success){
                   PageNavigation.openDashboard();
               }else if(response){
                   if("0202" === code) {
                       MessageDialogController.showMessage("You need to change your password");
                       PageNavigation.openChangePasswordPage(username, password);
                   } else {
                       MessageDialogController.showMessage(response);
                   }
               }else{
                   MessageDialogController.showMessage("Unable to login. Please try again.");
               }
           });


        }, false);
    };

    //Disable the form element from refreshing and instead try to login.
    $("#auth-form").submit(function(e){
        e.preventDefault();
        login();
        return false;
    });

});

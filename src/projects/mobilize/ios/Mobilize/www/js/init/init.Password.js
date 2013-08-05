Init.invokeOnReady(function() {

    var username = PageNavigation.getPageParameter('username');
    var password = PageNavigation.getPageParameter('password');
    PageNavigation.unsetPageParameter('username');
    PageNavigation.unsetPageParameter('password');
    $('#current-password').val(password);

    if(auth.getUsername()) {
        $("#change-password").append(mwf.decorator.SingleClickButton("Profile", PageNavigation.openProfile));
        mwf.decorator.TopButton("Dashboard", null, PageNavigation.openDashboard , true);
    }

    var isInputValid = function(){

        if($('#current-password').val().length == 0){
            MessageDialogController.showMessage('Please enter your current password.');
            $('#current-password').focus();

            return false;
        }

        if($('#new-password').val().length == 0){
            MessageDialogController.showMessage('Please enter your new password.');
            $('#new-password').focus();
            return false;
        }


        if($('#confirm-password').val().length == 0){
            MessageDialogController.showMessage('Please confirm your password.');
            $('#confirm-password').focus();
            return false;
        }

        if($('#new-password').val() != $('#confirm-password').val()){
            MessageDialogController.showMessage('New password and password confirmation do not match.');
            $('#confirm-password').focus();
            return false;
        }

        if(!auth.isPasswordValid($('#new-password').val())){
            MessageDialogController.showMessage(auth.getPasswordRequirements());
            $('#new-password').focus();
            return false;
        }

        return true;

    };

    $("#change-password-submit").click(function(){

        if(!isInputValid())
            return;

        var currentPassword = $("#current-password").val();
        var newPassword     = $("#new-password").val();

        var onSuccess = function(response) {
            Spinner.hide(function(){
                auth.saveHashedPasswordResponse(response, username);
                MessageDialogController.showMessage('Your password has been successfully changed.');
                PageNavigation.openDashboard();
            });


        };

        var onError = function(response){
            Spinner.hide(function(){
                if(response){
                    MessageDialogController.showMessage(response.errors[0].text);
                }else{
                    MessageDialogController.showMessage('Network error occured. Please try again.');
                }

                $('#current-password').focus();
            });



        };

        Spinner.show();

        ServiceController.serviceCall(
             "POST",
             ConfigManager.getPasswordChangeUrl(),
             {
                 client:       ConfigManager.getClientName(),
                 user:         username || auth.getUsername(),
                 password:     currentPassword,
                 new_password: newPassword

             },
             "JSON",
             onSuccess,
             onError,
             false
        );

   });

});
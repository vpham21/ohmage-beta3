var ProfileController = function() {
    var that = {};
    
    that.changePasswordHandler = function() {
        PageNavigation.openChangePasswordPage();
    };
    
    that.clearCustomizedChoicesHandler = function() {
        var confirmMessage = "Are you sure you would like to clear all your custom choices?";
        var confirmButtonLabels = "Yes,No";
        var confirmCallback = function( confirmed ) {
            if( confirmed ) {
                CustomPropertiesVault.deleteAllCustomProperties();
                MessageDialogController.showMessage( "All custom choices have been cleared." );
            }
        };
        MessageDialogController.showConfirm( confirmMessage, confirmCallback, confirmButtonLabels );
    };
    
    that.logoutAndClearDataHandler = function() {
        if( auth.logout() ) {
            PageNavigation.openAuthenticationPage();
        }
    };
    
    that.renderProfileView = function() {
      
        var profileView = ProfileView();
        profileView.changePasswordHandler = that.changePasswordHandler;
        profileView.clearCustomizedChoicesHandler = that.clearCustomizedChoicesHandler;
        profileView.logoutAndClearDataHandler = that.logoutAndClearDataHandler;
        return profileView.render();
    };
    
    return that;
};
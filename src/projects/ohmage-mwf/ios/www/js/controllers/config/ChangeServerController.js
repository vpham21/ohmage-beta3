
var ChangeServerController = function() {
    var that = {};
    that.renderChangeServerView = function() {
        var changeServerView = ChangeServerView( ConfigManager.getServers() );
        changeServerView.saveButtonHandler = function() {

            var serverEndpoint = changeServerView.getSelectedServer();
            console.log( "ChangeServerController: New server endpoint was entered: [" + ConfigManager.getServerEndpoint() + "]." );
            if(!/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(serverEndpoint)) {
                MessageDialogController.showMessage("Please enter a valid server name.");

            } else {
                ConfigManager.setServerEndpoint( serverEndpoint );
                console.log( "ChangeServerController: Saved a new server endpoint [" + ConfigManager.getServerEndpoint() + "]." );
                MessageDialogController.showMessage( "Your selection has been saved.", PageNavigation.openAuthenticationPage );
            }

        };
        return changeServerView.render();
    };
    return that;
};
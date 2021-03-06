var ChangeServerView = function( servers ) {
    
    var that = {};
    
    /**
     * Handler for the save button. Should be implemented in the controller.
     */
    that.saveButtonHandler = function() {};
    
    that.render = function( ) {
        var form = mwf.decorator.Form("Available Servers");
        var select = document.createElement("select");
        for( var i = 0; i < servers.length; i++ ){
            var option = document.createElement('option');
            option.value = servers[i];
            option.innerHTML = servers[i];
            select.appendChild(option);
            if( servers[i] === ConfigManager.getServerEndpoint() ){
                option.selected = "selected";
            }
        }
        form.addLabel("Server Endpoint");
        form.addItem( select );
        that.getSelectedServer = function(){
            return select.options[ select.selectedIndex ].value;
        };
        form.addInputButton( "Save Selection", that.saveButtonHandler );
        return form;
    };

    return that;    
};

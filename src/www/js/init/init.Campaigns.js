 invokeOnReady(function(){

    //If set, only display installed campaigns.
    var installed = $.getUrlVar('display-installed-campaigns') == null || $.getUrlVar('display-installed-campaigns') == "true";

    var onSuccess = function(){
        $('#campaigns').append(Campaigns.render(installed));
    };

    var onError = function(){
        showMessage("Unable to download campaigns. Please try again later.")
    }

    Campaigns.download(false, onSuccess, onError);

 });

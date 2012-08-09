invokeOnReady(function(){

    var onSuccess = function(){
        $('#campaigns').append(Campaigns.render(false));
    };

    var onError = function(){
        showMessage("Unable to download campaigns. Please try again later.")
    }

    Campaigns.download(false, onSuccess, onError);

});

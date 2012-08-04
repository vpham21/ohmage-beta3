 invokeOnReady(function(){

    //If set, only display installed campaigns.
    var displayInstalledCampaigns = !PageNavigation.isPageParameterSet('display-installed-campaigns') || 
                                     PageNavigation.getPageParameter('display-installed-campaigns') === true;
   
    var onSuccess = function(){
        $('#campaigns').append(Campaigns.render(displayInstalledCampaigns));
    };

    var onError = function(){
        showMessage("Unable to download campaigns. Please try again later.")
    }

    Campaigns.download(false, onSuccess, onError);

 });

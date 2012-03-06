

function Campaigns(campaigns)
{
    var metadata = campaigns.metadata;
    var data     = campaigns.data;

    /**
     * Returns the campaign with the specified URN.
     */
    this.getCampaign = function(urn) {
        return new Campaign(data[urn]);
    };

    this.render = function(container)
    {
        var availableCampaigns = mwf.decorator.Menu("Available Campaigns");

        var openCampaign = function(urn){
            return function(){
                PageNavigation.openCampaignView(urn);
            };
        };

        for(var i = 0; i < metadata.number_of_results; i++){
            availableCampaigns.addMenuLinkItem(data[metadata.items[i]].name, "#")
                              .onclick = openCampaign(metadata.items[i]);
        }

        container.appendChild(availableCampaigns);

    };

}

Campaigns.init = function(callback)
{

    var onSuccess = function(response) {
        callback(new Campaigns(response));
    };

    var onError = function(response){
        //Pass in something cool to the callback function.
    };

    //Make and API call to get the campaigns.
    getCampaigns(onSuccess, onError);
};

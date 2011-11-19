

function Campaigns(campaigns)
{
    var metadata = campaigns.metadata;
    var data     = campaigns.data;
    
    /** 
     * Returns the campaign with the specified URN.
     */
    this.getCampaign = function(urn)
    {
        return new Campaign(data[urn]);
    }
    
    this.render = function(container)
    {

        var availableCampaigns = mwf.decorator.Menu("Available Campaigns");

        for(var i = 0; i < metadata.number_of_results; i++)
        {
            //Campaign URN.
            var urn = metadata.items[i];

            var link = "javascript:openCampaignView('" + urn + "')";

            availableCampaigns.addMenuLinkItem(data[urn].name, link);

        }

        container.append(availableCampaigns);

    };
    
}

Campaigns.init = function(callback)
{
    
    var onSuccess = function(response) 
    {
        var campaigns = new Campaigns(response);
        callback(campaigns);
    };

    var onError = function(response)
    {
        //Pass in something cool to the callback function.
    }
    
    //Make and API call to get the campaigns.
    getCampaigns(onSuccess, onError);
}

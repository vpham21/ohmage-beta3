 invokeOnReady(function(){

     var campaignURN = $.getUrlVar('campaign-urn');

     //If a specific campaign is not specified, take the user to the
     //campaigns view where the user may be able to choose an appropriate
     //campaign.
     if(!campaignURN){
         PageNavigation.openCampaignsView();
     }

     //Attach an event listener to the top right buttion to navigate the
     //user to the campaigns view.
     $('#button-top').click(function() {
         PageNavigation.openCampaignsView();
     });

     var campaign = new Campaign(campaignURN);

     document.getElementById('surveys').appendChild(campaign.render());

     document.getElementById('surveys').appendChild(mwf.decorator.SingleClickButton("Delete Campaign", function(){
         Campaigns.uninstallCampaign(campaignURN);
         PageNavigation.openCampaignsView();
     }));

 });

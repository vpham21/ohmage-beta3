invokeOnReady(function(){

    //Required for retreiving specific campaign configuration file.
    var campaignURN = PageNavigation.getPageParameter('campaign-urn');
    
    //Required for getting a specific survey from the campaign.
    var surveyID    = PageNavigation.getPageParameter('survey-id');
    
    //If a specific campaign is not specified, take the user to the
    //campaigns view where the user may be able to choose an appropriate
    //campaign.
    if(campaignURN === null){
        PageNavigation.openCampaignsView();
    }

    //If a specific survey is not specified, then take the user to the
    //campaign's survey view where he/she may choose a survey.
    else if(surveyID === null){
        PageNavigation.openCampaignView(campaignURN);
    }

    var campaign = new Campaign(campaignURN);
    var survey = campaign.getSurvey(surveyID);

    survey.start(document.getElementById('survey'));

    mwf.decorator.TopButton("All Campaigns", null, function(){
    var message = "Data from your current survey response will be lost. Are you sure you would like to continue?";

    showConfirm(message, function(yes){
        if(yes){
            survey.abort();
            PageNavigation.openCampaignsView(true);
        }
    }, "Yes,No");

    }, true);


});
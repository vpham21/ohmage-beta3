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
    
    var confirmToLeaveMessage = "Data from your current survey response will be lost. Are you sure you would like to continue?";
    var confirmLeave = function(resultCallback){
        showConfirm(confirmToLeaveMessage, function(isResponseYes){
            if( isResponseYes ){ survey.abort(); }
            if( typeof(resultCallback) === "function" ){ resultCallback(isResponseYes); }
        }, "Yes,No");
    };

    mwf.decorator.TopButton("All Campaigns", null, function(){
        confirmLeave(function(isResponseYes){
            if( isResponseYes ){ PageNavigation.openCampaignsView(true); }
        }); 
    }, true);
    
    $("#header-link,#footer-link").click(function(e){
       confirmLeave(function(isResponseYes){
          if( !isResponseYes ){ e.preventDefault(); }
       });
    });


});
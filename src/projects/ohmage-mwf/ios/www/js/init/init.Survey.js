Init.invokeOnReady(function() {

    //Required for retreiving specific campaign configuration file.
    var campaignURN = PageNavigation.getPageParameter('campaign-urn') || $.getUrlVars()["campaign-urn"];
    //Required for getting a specific survey from the campaign.
    var surveyID    = PageNavigation.getPageParameter('survey-id') || $.getUrlVars()["survey-id"];

    //If a specific campaign is not specified, take the user to the
    //campaigns view where the user may be able to choose an appropriate
    //campaign.
    if( campaignURN === null || surveyID === null ) {

        PageNavigation.goBack();

    } else {

        PageNavigation.unsetPageParameter("survey-id");

        var campaign = new Campaign( campaignURN );
        var surveyModel = campaign.getSurvey( surveyID );

        var surveyController = SurveyController( surveyModel );

        var navigation = surveyController.start(document.getElementById('survey'));

        var closeChildWindow = function () {
            window.onbeforeunload = null;
            close();
        };

        window.onbeforeunload = function() {
            return "Data from your current survey response will be lost. Are you sure you would like to continue?";
        };

        mwf.decorator.TopButton("All Surveys", null, function(){
            navigation.confirmSurveyExit(function() {
                if (DeviceDetection.isNativeApplication()) {
                    PageNavigation.openCampaignView(campaignURN, surveyID);
                } else {
                    closeChildWindow();
                }

            });
        }, true);

        $("#header-link").click(function() {
            navigation.confirmSurveyExit(function() {

                if (DeviceDetection.isNativeApplication()) {
                    PageNavigation.openDashboard();
                } else {
                    closeChildWindow();
                }

            });
        });
    }
});
var PageNavigation = function()
{

}

/**
 * Method redirects the user to a specified URL. Although this can be easily
 * achieved via a simple document.location = "..." statement, the reason that
 * this method is prefered is because in a native environment redirection
 * mechansim might change.
 *
 * @param url The URL to redirect to. If null or undefined, the method exits
 *            without throwing any errors.
 */
PageNavigation.redirect = function(url)
{
    if(url){
        document.location = url;
    }
}

/**
 * PageNavigation.redirects the user to the page that displays a list of available campaigns.
 */
PageNavigation.openCampaignsView = function()
{
    PageNavigation.redirect("campaigns.html");
}

/**
 * PageNavigation.redirects the user to the page that displays the campaign's surveys.
 *
 * @param campaignURN The unique identifier of the campaign to display.
 *
 */
PageNavigation.openCampaignView = function(campaignURN)
{
    PageNavigation.redirect("campaign.html?campaignURN=" + campaignURN);
}

/**
 * PageNavigation.redirects the user to the page that displays a list of submitted but not yet
 * uploaded surveys..
 *
 */
PageNavigation.openUploadQueueView = function()
{
    PageNavigation.redirect("upload-queue.html");
}

/**
 * PageNavigation.redirects the user to the page that displays the campaign's surveys.
 *
 * @param campaignURN The unique identifier of the survey's campaign.
 * @param surveyID The unique identifier of the campaign's survey to display.
 */
PageNavigation.openSurveyView = function(campaignURN, surveyID)
{
    PageNavigation.redirect("survey.html?campaignURN=" + campaignURN +
                           "&surveyID=" + surveyID);
}

PageNavigation.openAuthenticationPage = function(){
    PageNavigation.redirect("auth.html");
}

PageNavigation.openDashboard = function(){
    PageNavigation.redirect("index.html");
}
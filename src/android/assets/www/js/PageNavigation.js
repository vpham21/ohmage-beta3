var PageNavigation = function(){};

/**
 * Method redirects the user to a specified URL. Although this can be easily
 * achieved via a simple document.location = "..." statement, the reason that
 * this method is prefered is because in a native environment redirection
 * mechansim might change.
 *
 * @param url The URL to redirect to. If null or undefined, the method exits
 *            without throwing any errors.
 */
PageNavigation.redirect = function(url){
    if(url){
        document.location = url;
    }
};

/**
 * Eedirects the user to the page that displays a list of set reminders and 
 * allows users 
 */
PageNavigation.openRemindersView = function(){
    PageNavigation.redirect("reminders.html");
};

PageNavigation.openReminderView = function(uuid){
    PageNavigation.redirect("reminder.html" + ((typeof(uuid) !== "undefined")? "?uuid=" + uuid : ""));
};

/**
 * Redirects the user to the page that displays a list of available or installed
 * campaigns.
 */
PageNavigation.openCampaignsView = function(installed){
    PageNavigation.redirect("campaigns.html?display-installed-campaigns=" + ((installed || typeof(installed) == "undefined")? "true" : "false"));
};

/**
 * PageNavigation.redirects the user to the page that displays the campaign's surveys.
 *
 * @param campaignURN The unique identifier of the campaign to display.
 *
 */
PageNavigation.openCampaignView = function(campaignURN){
    PageNavigation.redirect("campaign.html?campaign-urn=" + campaignURN);
};

/**
 * PageNavigation.redirects the user to the page that displays a list of submitted but not yet
 * uploaded surveys..
 *
 */
PageNavigation.openUploadQueueView = function(){
    PageNavigation.redirect("upload-queue.html");
};

/**
 * PageNavigation.redirects the user to the page that displays the campaign's surveys.
 *
 * @param campaignURN The unique identifier of the survey's campaign.
 * @param surveyID The unique identifier of the campaign's survey to display.
 */
PageNavigation.openSurveyView = function(campaignURN, surveyID){
    PageNavigation.redirect("survey.html?campaign-urn=" + campaignURN + "&survey-id=" + surveyID);
};

PageNavigation.openAuthenticationPage = function(){
    PageNavigation.redirect("auth.html");
};

PageNavigation.openDashboard = function(){
    PageNavigation.redirect("index.html");
};
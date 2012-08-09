invokeOnReady(function(){

    var reminders = new Reminders();

    $("#reminders").append(reminders.render());

    //Add a button to take the user back to the dashboard.
    $("#reminders").append(mwf.decorator.DoubleClickButton("Dashboard", PageNavigation.openDashboard,
                                                           "Pending Surveys", PageNavigation.openPendingSurveysView));

    //Top button to open all the available campaigns.
    mwf.decorator.TopButton("All Campaigns", null, PageNavigation.openInstalledCampaignsView, true);

});
invokeOnReady(function(){
    $("#reminders").append((new RemindersView()).render());
    $("#reminders").append(mwf.decorator.DoubleClickButton("Dashboard", PageNavigation.openDashboard,
                                                           "Pending", PageNavigation.openPendingSurveysView));
    mwf.decorator.TopButton("All Campaigns", null, PageNavigation.openInstalledCampaignsView, true);
});
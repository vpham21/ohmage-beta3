invokeOnReady(function(){
    var controller = new ReminderController(PageNavigation.getPageParameter('uuid'));
    $("#view-container").append(controller.render());
    $("#view-container").append(mwf.decorator.SingleClickButton("Dashboard", PageNavigation.openDashboard));
    mwf.decorator.TopButton("All Campaigns", null, PageNavigation.openInstalledCampaignsView, true);
});
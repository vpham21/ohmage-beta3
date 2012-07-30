invokeOnReady(function(){
    var uuid = $.getUrlVar('uuid');
    var controller = new ReminderController(uuid);
    $("#view-container").append(controller.render());
    $("#view-container").append(mwf.decorator.SingleClickButton("Dashboard", function(){
        PageNavigation.openDashboard();
    }));
    mwf.decorator.TopButton("All Campaigns", null, function(){
        PageNavigation.openCampaignsView(true);
    }, true);
});
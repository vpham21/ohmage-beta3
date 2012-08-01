invokeOnReady(function(){

    var reminders = new Reminders();

    $("#surveys").append(reminders.render());

    //Add a button to take the user back to the dashboard.
    $("#surveys").append(mwf.decorator.SingleClickButton("Dashboard", function(){
        PageNavigation.openDashboard();
    }));

    //Top button to open all the available campaigns.
    mwf.decorator.TopButton("All Campaigns", null, function(){
        PageNavigation.openCampaignsView(true);
    }, true);

});
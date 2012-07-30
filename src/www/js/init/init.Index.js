invokeOnReady(function(){
    console.log("Device Ready: index.html");
    (function(){

        mwf.decorator.TopButton((auth.isUserAuthenticated()) ? "Logout" : "Login", null, function(){

            if(auth.isUserAuthenticated()){
                auth.logout();
            }else{
                PageNavigation.openAuthenticationPage();
            }

        }, true);

    })();

    var queueSize = SurveyResponse.getUploadQueueSize();
    var queueLabel = "Queue (" + queueSize + ")";

    var dashboard = mwf.decorator.Menu();

    dashboard.addMenuImageItem('Campaigns', 'campaigns.html',    'img/dash/dash_campaigns.png');
    dashboard.addMenuImageItem('Surveys',   'surveys.html',      'img/dash/dash_surveys.png');
    dashboard.addMenuImageItem( queueLabel, 'upload-queue.html', 'img/dash/dash_upqueue.png');
    dashboard.addMenuImageItem('Profile',   'profile.html',      'img/dash/dash_profile.png');
    dashboard.addMenuImageItem('Help',      'help.html',         'img/dash/dash_help.png');
    dashboard.addMenuImageItem('Reminders', 'reminders.html',    'img/dash/dash_reminders.png');


    $('#dashboard').append(dashboard);

});

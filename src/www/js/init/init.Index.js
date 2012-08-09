invokeOnReady(function(){
    
    mwf.decorator.TopButton("Logout" , null, auth.logout, true);
    
    var queueSize = SurveyResponse.getUploadQueueSize();
    var queueLabel = "Queue (" + queueSize + ")";

    var dashboard = mwf.decorator.Menu();

    dashboard.addMenuImageItem('Campaigns', 'installed-campaigns.html',    'img/dash/dash_campaigns.png');
    dashboard.addMenuImageItem('Surveys',   'surveys.html',                'img/dash/dash_surveys.png');
    dashboard.addMenuImageItem( queueLabel, 'upload-queue.html',           'img/dash/dash_upqueue.png');
    dashboard.addMenuImageItem('Profile',   'profile.html',                'img/dash/dash_profile.png');
    dashboard.addMenuImageItem('Help',      'help.html',                   'img/dash/dash_help.png');
    dashboard.addMenuImageItem('Reminders', 'reminders.html',              'img/dash/dash_reminders.png');


    $('#dashboard').append(dashboard);

});

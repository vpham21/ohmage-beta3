var ReminderController = function(uuid){
  
    var self = {};
    
    var model = (uuid)? new ReminderModel().restore(uuid) : new ReminderModel();
    var view =  new ReminderView(model, self);
    
    self.render = function(){
        return view.render();
    };
    
    self.save = function(campaignURN, surveyID, title, date, supressionWindow, recurrences, excludeWeekends){
        model.setAssociation(campaignURN, surveyID);
        model.setSupressionWindow(supressionWindow);
        model.setExcludeWeekends(excludeWeekends);
        model.setTitle(title);
        model.setMessage("Reminder: " + title);
        model.cancelAllReminders();
        
        //Returns a new date that is 24 hours ahead of the specified day.
        var nextDay = function(date){
            return new Date(date.getTime() + (24 * 60 * 60 * 1000));
        };
        
        //If the user has set an alarm with an initial date in the past, then
        //skip the current day. Otherwise, a notification will be triggered 
        //as soon as the reminder is set.
        if(date.getTime() < new Date().getTime()){
            date = nextDay(date);
        }
        
        for(var i = 0; i < recurrences; i++){
            if(model.excludeWeekends()){
                while(date.getDay() === 6 || date.getDay() === 0){
                    date = nextDay(date);
                }
            } 
            model.addReminder(date);
            date = nextDay(date);
        }
        
        model.save();
    };
    
    
    
    self.getReminderCount = function(){
        return getAllReminders().length;
    };
    
    return self;
};

ReminderController.getAllReminders = function(purge){
    if(purge || typeof(purge) === "undefined"){
        ReminderController.purge();
    }
    
    var remindersMap = new LocalMap("reminders").getMap();    
    var allReminders = [];        
    for(var uuid in remindersMap){
        var reminder = new ReminderModel();
        reminder.restore(uuid)
        allReminders.push(reminder);
    }
    return allReminders;
};

ReminderController.purge = function(){
    
    //Extract a list of all installed and running campaign URNs.
    var installedCampaigns = Campaigns.getInstalledCampaigns();
    var installedCampaignsURNList = [];
    var i;
    for(i = 0; i < installedCampaigns.length; i++){
        if(installedCampaigns[i].isRunning()){
            installedCampaignsURNList.push(installedCampaigns[i].getURN());
        }
    }
        
    //Returns true if the speicified campaign is currently installed.
    var isCampaignInstalled = function(urn){
        for(var i = 0; i < installedCampaignsURNList.length; i++){
            if(installedCampaignsURNList[i] === urn){
                return true;
            }
        }
        return false;
    };
    
    //Iterate through the list of current reminders, and delete those that are
    //associated with campaigns that have been deleted or those reminders that
    //are expired.
    var reminders = ReminderController.getAllReminders(false);
    for(i = 0; i < reminders.length; i++){
        if(!isCampaignInstalled(reminders[i].getCampaignURN()) || reminders[i].isExpired()){
            reminders[i].deleteReminder();
        }
    }
};

ReminderController.supressSurveyReminders = function(surveyID){
    console.log("Supressing all reminders for survey [" + surveyID + "].");
    var reminders = ReminderController.getAllReminders(false);
    for(i = 0; i < reminders.length; i++){
        if(reminders[i].getSurveyID() === surveyID){
            reminders[i].suppress();
        }
    }
};

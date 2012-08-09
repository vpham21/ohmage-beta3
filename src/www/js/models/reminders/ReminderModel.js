var ReminderModel = function(){
    
    var self = this;
    
    var remindersMap = new LocalMap("reminders");
    
    var title = "";
    var campaignURN = "";
    var surveyID = ""
    var uuid = UUIDGen.generate();
    var message = "";
    var ticker = "";
    var supressionWindow = 24;
    var excludeWeekends = false;
    var reminders = [];
    
    //This method does not alter the reminders array. 
    var cancelReminder = function(id){
        console.log("ReminderModel: Canceling reminder with id [" + id + "] associated with survey [" + surveyID + "]");
        LocalNotificationAdapter.cancel(id);
    };
    
    
    var toJSON = function(){
        var json = {
            title             : title,
            campaign_urn      : campaignURN,
            survey_id         : surveyID,
            messsage          : message,
            ticker            : ticker,
            supression_window : supressionWindow,
            exclude_weekends  : excludeWeekends
        };
        var remindersJSON = [];
        for(var i = 0; i < reminders.length; i++){
            remindersJSON.push({
               id   : reminders[i].id,
               time : reminders[i].date.getTime()
            });
        }
        json.reminders = remindersJSON;
        return json;
    };
   
    self.addReminder = function(date){
        var id = uuid + "-" + reminders.length;
        var options = {
            date        : date,
            message     : message,
            ticker      : ticker,
            repeatDaily : false,
            id : id
        };
        console.log("ReminderModel: Reminder was set with the following options - " + JSON.stringify(options));
        LocalNotificationAdapter.add(options);
        reminders.push({id : id, date : date});
    };
    
    self.save = function(){
        remindersMap.set(uuid, toJSON());  
    };
    
    self.isSaved = function(){
        return remindersMap.isSet(uuid);
    };
    
    /**
     * This method is useful when updating the reminder. Instead of deleting and
     * recreating a reminder - the controller can cancel all the current set 
     * notifications, and add new reminders according to the user's 
     * modification. 
     */
    self.cancelAllReminders = function(){
        for(var i = 0; i < reminders.length; i++){
            cancelReminder(reminders[i].id);
        }
        reminders = [];
        self.save();
    };
    
    self.deleteReminder = function(){
        self.cancelAllReminders();
        remindersMap.release(uuid);
    };
    
    self.suppress = function(date){
        date = date || new Date();
        var active = [];
        for(var i = 0; i < reminders.length; i++){
            var reminder = reminders[i];
            var diff = reminder.date.getTime() - date.getTime();
            if(0 < diff && diff < supressionWindow * 60 * 60 * 1000){
                cancelReminder(reminders[i].id);
            }else{
                active.push(reminder);
            }
        }
        reminders = active;
        if(reminders.length === 0){
            self.deleteReminder();
        }else{
            self.save();
        }
    };
    
    self.restore = function(storedUUID){
        var object = remindersMap.get(storedUUID);
        uuid             = storedUUID;
        title            = object.title;
        campaignURN      = object.campaign_urn;
        surveyID         = object.survey_id;
        message          = object.message;
        ticker           = object.ticker;
        supressionWindow = object.supression_window;
        excludeWeekends  = object.exclude_weekends;
        reminders = [];
        for(var i = 0; i < object.reminders.length; i++){	
            reminders.push({
                id   : object.reminders[i].id,
                date : new Date(object.reminders[i].time)
            });
        }
        return self;
    };
    
    self.setAssociation = function(newCampaignURN, newSurveyID){
        campaignURN = newCampaignURN
        surveyID    = newSurveyID;
    };
    
    self.setMessage = function(newMessage){
        message = newMessage;
        ticker  = newMessage;
    };
    
    self.setTitle = function(newTitle){
        title = newTitle;
    };
    
    self.setSupressionWindow = function(newSupressionWindow){
        supressionWindow = newSupressionWindow;
    };
    
    self.setExcludeWeekends = function(newExcludeWeekends){
        excludeWeekends = newExcludeWeekends;
    };
    
    /**
     * A remineder is expired if it doesn't have any more reminders, or if the 
     * last reminder is in the past.
     */
    self.isExpired = function(){
        return reminders.length == 0 || reminders[reminders.length - 1].date.getTime() <= new Date().getTime();
    };
    
    self.getUUID = function(){
        return uuid;
    }
    
    self.getCampaignURN = function(){
        return campaignURN;
    };
    
    self.getSurveyID = function(){
        return surveyID;
    };
    
    self.getTitle = function(){
        return title;
    };
    
    self.getDate = function(){
        return (reminders.length !== 0)? reminders[0].date : null;
    };
    
    self.getSupressionWindow = function(){
        return parseInt(supressionWindow);
    };
    
    self.excludeWeekends = function(){
        return excludeWeekends;
    };
    
    self.getRecurrence = function(){
        return reminders.length;
    }
    
    return self;
};
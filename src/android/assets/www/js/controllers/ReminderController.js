var ReminderController = function(uuid){
  
    var self = {};
    
    var model = (uuid)? new ReminderModel().restore(uuid) : new ReminderModel();
    var view =  new ReminderView(model, self);
    
    self.render = function(){
        return view.render();
    };
    
    self.save = function(campaignURN, surveyID, title, date, supressionWindow, recurrences){
        console.log(campaignURN, surveyID, title, date, supressionWindow, recurrences);
        model.setAssociation(campaignURN, surveyID);
        model.setSupressionWindow(supressionWindow);
        model.setTitle(title);
        model.cancelAllReminders();
        for(var i = 0; i < recurrences; i++){
            model.addReminder(date);
            //Increment by a day.
            date = new Date(date.getTime() + (24 * 60 * 60 * 1000));
        }
        model.save();
    };
    
    
    
    self.getReminderCount = function(){
        return getAllReminders().length;
    };
    
    return self;
};

ReminderController.getAllReminders = function(){
    var remindersMap = new LocalMap("reminders").getMap();    
    var allReminders = [];        
    for(var uuid in remindersMap){
        var reminder = new ReminderModel();
        reminder.restore(uuid)
        allReminders.push(reminder);
    }
    return allReminders;
};
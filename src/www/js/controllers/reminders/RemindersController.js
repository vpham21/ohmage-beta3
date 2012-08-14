var RemindersController = function(){
    var self = {};
    
    self.render = function(){
        var reminders = ReminderModel.getAllReminders();
        var view = new RemindersView(reminders);
        return view.render();
    };
    
    return self;
};
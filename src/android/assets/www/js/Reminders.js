
var Reminders = function(){
    
    var self = this;
    
    var reminders = ReminderController.getAllReminders();
    
    var newReminderCallback = function(){
        PageNavigation.openReminderView();
    };
    
    var editReminderCallback = function(reminder){
        return function(){
            PageNavigation.openReminderView(reminder.getUUID());
        };
        
    };
    
    self.render = function(){
        
        var menu = mwf.decorator.Menu("Available Reminders");
        
        if(Campaigns.isEmpty()){
            menu.addMenuLinkItem("No Available Surveys", null, "Please install a campaign, to create custom reminders.").onclick = function(){
                PageNavigation.openDashboard(false);
            };   
        }else if(reminders.length > 0){
            for(var i = 0; i < reminders.length; i++){   
                var title = reminders[i].getTitle();
                var date  = reminders[i].getDate();
                var time   = "Reminder set for " + date.getHours() + ":" + date.getMinutes() + ".";
                menu.addMenuLinkItem(title, null, time).onclick = editReminderCallback(reminders[i]);
            }
        }else{
            menu.addMenuLinkItem("No Reminder Founds", null, "Click to add a new reminder.").onclick = newReminderCallback;
        }
        
        var container = document.createElement('div');
        container.appendChild(menu);
        container.appendChild(mwf.decorator.SingleClickButton("Add Reminder", newReminderCallback));
        return container;
        
    };
    
    return self;
    
};


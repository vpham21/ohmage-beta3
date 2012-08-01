
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
        
        var numInstalledCampaigns = Campaigns.getInstalledCampaignsCount();
        var menu = mwf.decorator.Menu("Available Reminders");
        
        if(numInstalledCampaigns === 0){
            menu.addMenuLinkItem("No Available Surveys", null, "Please install a campaign, to create custom reminders.").onclick = function(){
                PageNavigation.openCampaignsView();
            };   
        }else if(reminders.length > 0){
            for(var i = 0; i < reminders.length; i++){   
                var title = reminders[i].getTitle();
                var date  = reminders[i].getDate();
                var time   = "Reminder set for " + DateTimePicker.getPaddedTime(date) + ".";
                menu.addMenuLinkItem(title, null, time).onclick = editReminderCallback(reminders[i]);
            }
        }else{
            menu.addMenuLinkItem("No Reminder Founds", null, "Click to add a new reminder.").onclick = newReminderCallback;
        }
        
        var container = document.createElement('div');
        container.appendChild(menu);
        if(numInstalledCampaigns > 0){
            container.appendChild(mwf.decorator.SingleClickButton("Add Reminder", newReminderCallback));
        }
        return container;
        
    };
    
    return self;
    
};


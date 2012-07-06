
var Reminders = function(){
    
    var self = this;
    var campaigns = Campaigns.getInstalledCampaigns();
    var reminders = new LocalMap("reminders");
    
    this.getReminders = function(){
        
        var remindersMap = reminders.getMap();
        var allReminders = [];
        var reminder;
        
        
        for(var campaignURN in remindersMap){
            for(var surveyID in remindersMap[campaignURN]){
                reminder = remindersMap[campaignURN][surveyID];
                allReminders.push({
                   campaignURN : campaignURN,
                   surveyID : surveyID,
                   date: reminder.date,
                   id: reminder.id,
                   title: reminder.title
                });
            }
        }
        
        return allReminders;
    };
    
    /**
     * Returns the current number of reminders.
     */
    this.getReminderCount = function(){
        return getReminders().length;
    };
    
    this.getCampaignReminders = function(campaignURN){
        var campaignReminders = reminders.get(campaignURN);
        if(campaignReminders === null){
            campaignReminders = {};
            reminders.set(campaignURN, campaignReminders);
        }
        return campaignReminders;
    };
    
    this.addReminder = function(title, surveyID, campaignURN, date, id){
        
        var campaignReminders = self.getCampaignReminders(campaignURN);
        campaignReminders[surveyID] = {
            title: title,
            date: date,
            id: id
        };  
        reminders.set(campaignURN, campaignReminders);
    };
    
    this.removeReminder = function(surveyID, campaignURN){
        var campaignReminders = self.getCampaignReminders(campaignURN);
        if(campaignReminders[surveyID]){
            delete campaignReminders[surveyID];
        }
        reminders.set(campaignURN, campaignReminders);
    };
    
    this.render = function(){
        
        var remindersMenu = mwf.decorator.Menu("Available Reminders");
        
        if(campaigns.length === 0){
            remindersMenu.addMenuLinkItem("No Available Surveys", null, "Please install a campaign, to create custom reminders.").onclick = function(){
                PageNavigation.openDashboard(false);
            };   
            return remindersMenu;
        }
        
        var container = document.createElement('div');
        var allReminders = self.getReminders();
        
        var newReminderForm = self.renderNewReminderForm();
        

        if(allReminders.length > 0){
            var deleteReminderCallback = function(reminder){
                return function(){
                    var confirmMessage = "Are you sure you would like to delete the reminder for " + reminder.title + "?";
                    var callback = function(yes){
                        if(yes){
                            self.removeReminder(reminder.surveyID, reminder.campaignURN);
                            PageNavigation.openReminderesView();
                        }
                    };
                    showConfirm(confirmMessage, callback, "Yes,No");
                    
                };
            };
            
            for(var i = 0; i < allReminders.length; i++){
                var reminder = allReminders[i];
                remindersMenu.addMenuLinkItem(reminder.title, null, reminder.date).onclick = deleteReminderCallback(reminder);
            }
            
            $(remindersMenu).find("a").css('background', "url('img/close-icon.png') no-repeat 95% center");
            
        }else{
            remindersMenu.addMenuLinkItem("No Reminders Found", null, "Add reminders and never forget to participate in a survey again.").onclick = function(){
                newReminderForm.showReminderForm();
            };   
        }
        
        
        
        container.appendChild(remindersMenu);
        container.appendChild(newReminderForm);
        
        return container;
        
    };
    

    
    this.renderNewReminderForm = function(){
        var cancelPropegation = function(e){
            //e.cancelBubble is supported by IE - this will kill the bubbling process.
            e.cancelBubble = true;
            e.returnValue = false;

            //e.stopPropagation works only in Firefox.
            if (e.stopPropagation){
                e.stopPropagation();
                e.preventDefault();
            }
        }
        
        var createSuppressionSelect = function(){
            var select = document.createElement('select');
            for(var i = 0; i < 24; i++){
                var option = document.createElement('option');
                option.value = i;
                option.innerHTML = i + " hour" + ((i != 1) ? "s" : "");
                select.appendChild(option);
            }
            return select;
        }
        
        var createOption = function(title, surveyID, campaignURN){
            var option = document.createElement('option');
            option.survey = {
                title: title,
                surveyID: surveyID,
                campaignURN: campaignURN
            };
            option.innerHTML = title;
            return option;
        };

        var createSurveySelectBox = function(){
            var selectBox = document.createElement('select');

            selectBox.appendChild(createOption("Select a Survey to Continue"));
            
            for(var i = 0; i < campaigns.length; i++){
                if(campaigns[i].isRunning()){
                    var surveys = campaigns[i].getSurveys();
                    for(var j = 0; j < surveys.length; j++){
                        selectBox.appendChild(createOption(surveys[j].title, surveys[j].id, campaigns[i].getURN()));
                    }
                    
                }
            }
            return selectBox;
        };

        var selectBox = createSurveySelectBox();    

        var date = new Date();
        var dateTimePicker = new DateTimePicker();
        var timePicker = dateTimePicker.createTimePicker(date);
        var suppressionSelect = createSuppressionSelect();

        var container = document.createElement('div');
        var newReminderForm = mwf.decorator.Form("Create New Reminder");
        newReminderForm.addLabel("Reminder Survey");
        newReminderForm.addItem(selectBox);
        newReminderForm.addLabel("Select Time");
        newReminderForm.addItem(timePicker);
        newReminderForm.addLabel("Suppression Window");
        newReminderForm.addItem(suppressionSelect);
        newReminderForm.addSubmitButton("Add Reminder", function(e){
            cancelPropegation(e);
            
            if(selectBox.selectedIndex === 0){
                alert("Please select a survey to add a reminder.");
                return;
            }
            
            var survey = selectBox.options[selectBox.selectedIndex].survey;
            var date = new Date();
            var id = 0;
            
            self.addReminder(survey.title, survey.surveyID, survey.campaignURN, date, id);
            
            container.hideReminderForm();
            PageNavigation.openReminderesView();
            
        });
        
        var showNewReminderFormButton = mwf.decorator.SingleClickButton("Create New Reminder");
        var hideNewReminderFormButton = mwf.decorator.SingleClickButton("Hide New Reminder Form");
        
        container.showReminderForm = function(){
            container.appendChild(newReminderForm);
            container.appendChild(hideNewReminderFormButton);
            container.removeChild(showNewReminderFormButton);
        };
        
        container.hideReminderForm = function(){
            container.removeChild(newReminderForm);
            container.removeChild(hideNewReminderFormButton);
            container.appendChild(showNewReminderFormButton);
        };
        
        showNewReminderFormButton.click(container.showReminderForm);
        hideNewReminderFormButton.click(container.hideReminderForm);

        container.appendChild(showNewReminderFormButton);
        
        return container;
         
    };
};


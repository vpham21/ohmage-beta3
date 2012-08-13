var PendingSurveysController = function(){
    
    var self = {};
    
    var reminders = ReminderController.getAllReminders();
    
    var getPendingSurveys = function(){
        
        var surveys = [];
        var campaign;
        var currentDate = new Date().getTime();
        for(var i = 0; i < reminders.length; i++){
            if(reminders[i].getDate().getTime() < currentDate){
                campaign = new Campaign(reminders[i].getCampaignURN());
                surveys.push(campaign.getSurvey(reminders[i].getSurveyID()));
            }
        }
        
        return surveys;
    };
    
    self.render = function(){
        var onSurveyClickCallback = function(survey){
            alert(survey.getID());
        };
        var surveyListView = new SurveyListView(getPendingSurveys(), "Pending Surveys", onSurveyClickCallback);
        surveyListView.setEmptyListViewParameters("You have no pending surveys.", "Please navigate to the reminders to set new notifications.", PageNavigation.openRemindersView);
        return surveyListView.render();
    };
    
    return self;
    
};
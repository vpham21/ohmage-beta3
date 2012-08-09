var PendingSurveysController = function(){
    
    var self = {};
    
    var reminders = ReminderController.getAllReminders();
    
    var getPendingSurveys = function(){
        return [];
    };
    
    self.render = function(){
        var onSurveyClickCallback = function(survey){
            alert(survey.getID());
        };
        return ((new SurveyListView(getPendingSurveys(), "Pending Surveys", onSurveyClickCallback)).render());
    };
    
    return self;
    
};
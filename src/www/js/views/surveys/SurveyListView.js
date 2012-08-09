var SurveyListView = function(surveys, title, onSurveyClickCallback){
    
    var self = {};
    
    self.render = function(menu){
        
        menu = menu || mwf.decorator.Menu(title);

        var onSurveyClickCallbackClosure = function(survey){
            return function(){
                onSurveyClickCallback(survey);
            };
        };
        
        for(var i = 0; i < surveys.length; i++){
            var menuItem = menu.addMenuLinkItem(surveys[i].title, null, surveys[i].description);
            TouchEnabledItemModel.bindTouchEvent(menuItem, onSurveyClickCallbackClosure(surveys[i]));   
        }

        return menu;
    };
    
    return self;
};
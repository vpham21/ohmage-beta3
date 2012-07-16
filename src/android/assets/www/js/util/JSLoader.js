var JSLoader = function(){
    var self = this;
    var root = "js";
    var groups = {
        
        jquery : [
            "jquery",
            "jquery.extensions",
            "jquery.xml2json"
        ],
        mwf : [
            "mwf",
            "decorator",
            "button",
            "content",
            "menu",
            "form",
            "header",
            "footer"
        ],
        util : [
            "Base64",
            "DateTimePicker",
            "LocalMap",
            "Spinner",
            "Strings",
            "UUIDGen",
            "jstz"
        ],
        
        pegjs : [
            "peg-0.7.0",
            "ConditionalParser"
        ],
        
        models : [
            "ReminderModel"
        ],
        
        views : [
            "ReminderView"
        ],
        
        controllers : [
            "ReminderController"
        ],
        js : [
            "Campaign",
            "Campaigns",
            "Help",
            "PageNavigation",
            "Profile",
            "Prompt",
            "PromptHandler",
            "Reminders",
            "Survey",
            "SurveyResponse",
            "SurveyResponseUploader",
            "UploadQueue",
            "UserAuthentication",
            "api",
            "navigation"
        ]
    };
    
    self.load = function(){
        for(var group in groups){
            for(var i = 0; i < groups[group].length; i++){
                var script = createScriptTag(group, groups[group][i]);
                document.getElementsByTagName("head")[0].appendChild(script);
                console.log(buildURL(group, groups[group][i]));
            }
        }
    };
    
    var buildURL = function(group, file){
        return ((group !== root) ? root + "/" : "") + group + "/" + file + ".js";
    }
    
    var createScriptTag = function(group, file){
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.src = buildURL(group, file);
        return script;
    };
    
};

new JSLoader().load();
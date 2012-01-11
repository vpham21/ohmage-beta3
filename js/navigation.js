


function Navigation(survey, container)
{

    /**
     * Value tag that indicates skipped prompt response value.
     */
    var SKIPPED_PROMPT_VALUE = "SKIPPED";
    
    /**
    * Value tag that indicates not displayed prompt response value.
    */
    var NOT_DISPLAYED_PROMPT_VALUE = "NOT_DISPLAYED";

    /**
     * Namespace abbreviation for Mobile Web Framework JS Decorators library.
     */
    var mwfd = mwf.decorator;
    
    /**
     * This variable utilizes JavaScript's closure paradigm to allow private
     * methods to invoke public methods. 
     */
    var me = this;
 
    /**
     * An array of prompts associated with the current survey.
     */
    var prompts = survey.getPrompts();
    
    /**
     * The response object for the current survey.
     */
    var surveyResponse = SurveyResponse.init(survey.getID());
    
    /**
    * Stores the index of the currently displayed prompt. Initialized to the
    * first prompt.
    */
    var currentPromptIndex = 0;
   
    /**
     * Callback for survey completed event. The actual response will not be 
     * submitted but will be passed as a reference object to this callback.
     */
    var surveyDoneCallback = null;
    
    this.start = function(callback)
    {
        //Update survey response geolocation information.
        surveyResponse.setLocation();   
        
        //Render the initial prompt.
        this.render();
        
        surveyDoneCallback = callback;  
        
       
    }
    
    /**
     * Method invoked when the user completes the survey and clicks submit.
     */
    this.done = function()
    {
        surveyResponse.recordSubmitTime();
        
        surveyDoneCallback(surveyResponse);
    }
    
    /**
     * Creates a buttont that navigates to the next prompt when clicked.
     * @return MWF SingleButton that navigates to the next prompt when clicked.
     */
    var createNextPromptButton = function()
    {
       return mwfd.SingleClickButton("Next Prompt", me.nextPrompt);  
    }
    
    var createSkipPromptButton = function()
    {
        return mwfd.SingleClickButton(me.getCurrentPrompt().getSkipLabel(), 
                                      me.skipPrompt);
    }

    /**
     * Enables or disables next, previous, submit, and skip buttons. 
     */
    this.getControlButtons = function()
    {
        //Control panel that acts as a container for control buttons.
        var panel = document.createElement('div');
        
        var currentPrompt = this.getCurrentPrompt();
        
        //If the prompt is skippable, then enable the skip button.
        if(!isAtSubmitPage() && currentPrompt.isSkippable())
        {   
            panel.appendChild(createSkipPromptButton());
        }
        
        //Handle first prompt.
        if(isAtFirstPrompt())
        {
            panel.appendChild(createNextPromptButton());   
        }
        
        //Handle submit page.
        else if(isAtSubmitPage())
        {
           panel.appendChild(
                mwfd.DoubleClickButton("Previous", me.previousPrompt,
                                       "Submit",   me.done)
            );
        }
        
        //Handle prompts in the middle.
        else 
        {
            panel.appendChild(
                mwfd.DoubleClickButton("Previous", me.previousPrompt,
                                       "Next",     me.nextPrompt)
            );
        }
           
       return panel;
    }
    
    
    /**
     * Returns currently displayed prompt. Returns null if current index is out
     * of bounds.
     * 
     * @return Current prompt.
     */
    this.getCurrentPrompt = function()
    {
        return prompts[currentPromptIndex] || null;
    }
    
    
    this.render = function()
    {
        //Clear the current contents of the main container. 
        container.innerHTML = "";
        
        (currentPromptIndex < prompts.length) ? renderPrompt() : renderSubmitPage();
        
        container.appendChild(this.getControlButtons());
    }
    
    var renderSubmitPage = function()
    {
        var menu = mwfd.Menu('Survey Completed');
        
        menu.addMenuTextItem('Done with ' + survey.getTitle());
        
        container.appendChild(menu);
    }
    
    var renderPrompt = function()
    {
        
        var currentPrompt = me.getCurrentPrompt();
             
        //If the rendering of the current prompt is supported, then add it to 
        //the container.
        if(currentPrompt.renderSupported()){
             container.appendChild(currentPrompt.render());
             
        } 
        
        //In case the prompt type is not supported, alert the user and indicate
        //in the survey response that the prompt was not displayed.
        else {
            alert("Prompt type is not supported.");
            surveyResponse.respond(currentPrompt.getID(), NOT_DISPLAYED_PROMPT_VALUE);
        }

    }
    
    this.nextPrompt = function(skipped){
        
        if(!me.processResponse(skipped))
            return;
        
        if(currentPromptIndex < prompts.length){
            currentPromptIndex++;
            me.render();
        }
    }
    
    this.previousPrompt = function()
    {
        if(currentPromptIndex > 0)
        {
            currentPromptIndex--;
            me.render();
        }
    }
    
    var isAtLastPrompt = function()
    {
        return currentPromptIndex == prompts.length - 1;
    }
    
    var isAtFirstPrompt = function()
    {
        return currentPromptIndex == 0;
    }
    
    var isAtSubmitPage = function()
    {
        return currentPromptIndex == prompts.length;
    }
    
    this.skipPrompt = function()
    {
        //Prompt processing is delegated to nextPrompt.
        me.nextPrompt(true);
    }
    
    this.processResponse = function(skipped)
    {
          
        //Be default, skipped is set to false.
        skipped = skipped || false;
        
        var prompt = this.getCurrentPrompt();
        
        //Handle skipped prompts.
        if(skipped){
               
            //User cannot skip prompts that are not skippable.
            if(!prompt.isSkippable()){
                return false;
            }
            
            surveyResponse.respond(prompt.getID(), SKIPPED_PROMPT_VALUE);
            
            return true;    
                
        }


        //Handle invalid responses.
        if(!prompt.isValid())
        {
            alert("Error Message:" + prompt.getErrorMessage());
            
            return false;
        }
        
        
        //Save the response.
        surveyResponse.respond(prompt.getID(), prompt.getResponse());
        
        return true;
    }
}



var SurveyResponse = function(id)
{
    /**
     * This variable utilizes JavaScript's closure paradigm to allow private
     * methods to invoke public methods. 
     */
    var me = this;
    
    /**
     * Enumaration object that describes location status. 
     */
    var LocationStatus = 
    {
        //If the status is unavailable, it is an error to send a location object.
        UNAVAILABLE : "unavailable",

        VALID       : "valid",
        INACCURATE  : 'inaccurate',
        STALE       : 'stale'

    }
    
    /**
     * A UUID unique to this survey response.
     */
    this.survey_key = createUUID();
    
    /**
     * A string defining a survey in the campaign's associated configuration file 
     * at the XPath /surveys/survey/id.
     */
    this.survey_id = id;
    
    /**
     * A string representing a standard time zone.
     */
    this.timezone = jstz.determine_timezone().name();
    
    /**
     * An int specifying the number of milliseconds since the epoch. 
     * This value will be set on survey response submission.
     */
    this.time = null;
    
    /**
     * An array composed of prompt responses and/or repeatable sets. By default 
     * user has no responses.
     */
    this.responses = {};
    
    /**
     * An object with variable properties that describes the survey's launch 
     * context. See the trigger framework page for a description of the object's
     * contents. The object must contain the property launch_time.
     */
    this.survey_lauch_context = 
    {
        launch_time     : new Date().getTime(),
        launch_timezone : jstz.determine_timezone().name(),
        active_triggers : []
    };
    
    /**
     * An object for housing location data.
     */
    this.location = null;
    
    this.setLocation = function()
    {
        
        mwf.touch.geolocation.getPosition(
            function(pos){ 

                //Create a new location object to house 
                //the location data.
                me.location = {};
                
                //Currently, there is no way of determining the geolocation 
                //provider but it's almost always going to be from the GPS 
                //device.
                me.location.provider = 'GPS';
    
                me.location.latitude  = pos['latitude'];
                me.location.longitute = pos['longitude'];
                me.location.accoracy  = pos['accuracy'];

                //A string describing location status. Must be one of: 
                //unavailable, valid, inaccurate, stale.
                me.location_status = LocationStatus.VALID;   
                
                //A long value representing the milliseconds since the epoch at 
                //hich time this location value was collected.
                me.location.time = new Date().getTime();
                
                //The timezone ID for the timezone of the device when this 
                //location value was collected.
                me.location.timezone = jstz.determine_timezone().name();
                
                me.save();
            },
            
            //On error, delete the location object if any and also set an 
            //appropriate location status.
            function(){
                
                delete this.location;
                
                this.location_status = LocationStatus.UNAVAILABLE;
                
                me.save();
            }
        );
    }
    
    this.save = function()
    {
        SurveyResponse.setPool(SurveyResponse.getPool()[id] = this);
    }
    
    this.respond = function(promptID, value)
    {
        
        this.responses[promptID] = value;
        this.save();
    }
    
    /**
     * Saves the current time as the survey completion time.
     */
    this.recordSubmitTime = function() 
    {
        this.time = new Date().getTime();   
    }
    
    this.submit = function(callback)
    {
        
    }
    
    /**
     * This function needs to be in a declaration form i.e. instead of 
     * var createUUID = function() {} because it is used during initialization.
     */
    function createUUID() {
        // http://www.ietf.org/rfc/rfc4122.txt
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }
    
    this.save();
    
    
}

SurveyResponse.init = function(id)
{
    var pool = SurveyResponse.getPool();

    //Extract the survey response from the pool of other survey responses, or 
    //create a new survey resoponse and return it.
    return (pool[id])? pool[id]: (pool[id] = new SurveyResponse(id));

}

SurveyResponse.getPool = function()
{
    return (localStorage.pool)? JSON.parse(localStorage.pool): [];
}

SurveyResponse.setPool = function(pool)
{
    localStorage.pool = JSON.stringify(pool);
}







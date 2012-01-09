
function Navigation(survey, container)
{
    var prompts = survey.getPrompts();
    
    /**
     * This variable utilizes JavaScript's closure paradigm to allow private
     * methods to invoke public methods. 
     */
    var me = this;
    
    /**
    * Stores the index of the currently displayed prompt. Initialized to the
    * first prompt.
    */
    var currentPromptIndex = 0;
   
    this.start = function(callback)
    {
        this.render();
    }
    
    this.done = function()
    {
        
    }

   
    /**
     * Enables or disables next, previous, and skip buttons. This method is also
     * responsible for attaching the correct event handler for each button.
     */
    this.getControlButtons = function()
    {
        var controlButtonsDiv = document.createElement('div');
        
        var currentPrompt = this.getCurrentPrompt();
        
        //If the prompt is skippable, then enable the skip button and add an
        //event handler of the button.
        if(currentPrompt.isSkippable())
        {   
            //Skip button that allows the user to skip a prompt. Initially, this button
            //is invisable, and is only enabled when the prompt is skipable.  
            var skipButton = mwf.decorator.SingleButton(currentPrompt.getSkipLabel());
            
            skipButton.click(function() {
                me.skipPrompt();
            });
            
            controlButtonsDiv.appendChild(skipButton);
        }
        
        //Handle single prompts. 
        if(prompts.length == 1)
        {
            var submitButton = mwf.decorator.SingleButton("Submit");
            
            submitButton.click(function()
            {
                me.submit();
            });
        }
        
        //Handle first prompt of a multi-prompt survey.
        else if(currentPromptIndex == 0)
        {
            var nextButton = mwf.decorator.SingleButton("Next Prompt");
            
            nextButton.click(function()
            {
                me.nextPrompt();
            });
            
            controlButtonsDiv.appendChild(nextButton);
            
        }
        
        //Handle last prompt of a multi-prompt survey.
        else if(currentPromptIndex == prompts.length - 1)
        {
            var prevButton = mwf.decorator.SingleButton("Previous Prompt");
            
            prevButton.click(function()
            {
                me.previousPrompt();
            });
            
            controlButtonsDiv.appendChild(prevButton);
        }
        
        //Handle prompts in the middle.
        else 
        {
            var controlButtons = mwf.decorator.SimpleDoubleButton("Previous", "Next");
            
            controlButtons.getFirstButton().click(function()
            {
                 me.previousPrompt();
            });
            
            controlButtons.getSecondButton().click(function()
            {
                me.nextPrompt();
            });
            
            controlButtonsDiv.appendChild(controlButtons);
        }
           
       return controlButtonsDiv;
    }
    
    
    /**
     * Returns currently displayed prompt.
     */
    this.getCurrentPrompt = function()
    {
        return prompts[currentPromptIndex];
    }
    
    
    this.render = function()
    {
   
        var currentPrompt = this.getCurrentPrompt();
     
        if(!currentPrompt.renderSupported())
        {
             alert("Prompt type is not supported.");
             return;

        }

        container.innerHTML = "";
        
        container.appendChild(currentPrompt.render());
        container.appendChild(this.getControlButtons());
        
       
    }
    
    this.nextPrompt = function(){
        
        if(!this.processResponse())
            return;
        
        if(currentPromptIndex < prompts.length){
            currentPromptIndex++;
            this.render();
        }
    }
    
    this.previousPrompt = function()
    {
        if(!this.processResponse())
            return;
        
        if(currentPromptIndex > 0)
        {
            currentPromptIndex--;
            this.render();
        }
    }
    
    this.skipPrompt = function()
    {
        this.nextPrompt();
    }
    
    this.processResponse = function()
    {
        var prompt = this.getCurrentPrompt();
        var validation = prompt.validate();
        
        if(!validation)
        {
            alert("Error Message:" + validation);
            
            return false;
        }
        else
        {
            //ToDo: Encapsulate these operations into a local storage class.
            var responses = (window.localStorage.responses)? 
                                JSON.parse(window.localStorage.responses):
                                {};
            
            //Extract the survey response frmo the pool of 
            //other survey responses.
            var survey      = (responses[survey.getID()])? 
                                responses[survey.getID()] : 
                                {};

            
            //Extract the prompt responses from the survey.
            var surveyResponses = survey.responses || (survey.responses = {});
            
            surveyResponses.push({prompt_id: prompt.getID(), value: prompt.getResponse()});
            
            
            responses[survey.getID()] = surveyResponses;
            
            window.localStorage.responses = JSON.stringify(responses);
            
            return true;
        }
    }

 
    
}



var SurveyResponse = function(id)
{
    this.survey_key = id;
    
    this.time = new Date().getTime();
}






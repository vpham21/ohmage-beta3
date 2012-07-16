
function Navigation(survey, container)
{

    /**
     * Namespace abbreviation for Mobile Web Framework JS Decorators library.
     */
    var mwfd = mwf.decorator;

    /**
     * An array of prompts associated with the current survey.
     */
    var prompts = survey.getPrompts();

    /**
     * The response object for the current survey.
     */
    var surveyResponse = SurveyResponse.init(survey.getID(), survey.getCampaign().getURN());

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

    /**
     * Returns currently displayed prompt. Returns null if current index is out
     * of bounds.
     *
     * @return Current prompt.
     */
    var getCurrentPrompt = function(){
        return prompts[currentPromptIndex] || null;
    }

    var getCurrentCondition = function(){
        return getCurrentPrompt().getCondition();
    }

    var failsCondition = function(){
        return getCurrentCondition() && !ConditionalParser.parse(getCurrentCondition(), surveyResponse.getResponses());
    }

    /**
     * Method invoked when the user completes the survey and clicks submit.
     */
    var done = function(){

        surveyResponse.submit();

        surveyDoneCallback(surveyResponse);
    }

    var processResponse = function(skipped){

        var prompt = getCurrentPrompt();

        //Handle skipped prompts.
        if(skipped){

            //User cannot skip prompts that are not skippable.
            if(!prompt.isSkippable()){
                return false;
            }

            surveyResponse.promptSkipped(prompt.getID());

            return true;

        }

        //Handle invalid responses.
        if(!prompt.isValid()){
            showMessage(prompt.getErrorMessage());
            return false;
        }

        //Save the response.
        surveyResponse.respond(prompt.getID(), prompt.getResponse(), prompt.getType() == 'photo');

        return true;
    }


    var nextPrompt = function(skipped){

        if(processResponse(skipped)){

            currentPromptIndex++;

            //Skip all prompts that fail the condition.
            while(currentPromptIndex < prompts.length && failsCondition()){
                surveyResponse.promptNotDisplayed(getCurrentPrompt().getID());
                currentPromptIndex++;
            }

            render();

        }

    }

    var previousPrompt = function(){

        if(currentPromptIndex > 0){
            currentPromptIndex--;
        }

        //Skip all prompts that fail the condition.
        while(currentPromptIndex > 0 && failsCondition()){
            currentPromptIndex--;
        }

        render();

    }

    /**
     * Enables or disables next, previous, submit, and skip buttons.
     */
    var getControlButtons = function(submitPage)
    {
        //Control panel that acts as a container for control buttons.
        var panel = document.createElement('div');

        //If the prompt is skippable, then enable the skip button.
        if(!submitPage && getCurrentPrompt().isSkippable()){
            panel.appendChild(mwfd.SingleClickButton(getCurrentPrompt().getSkipLabel(), function(){
                nextPrompt(true);
            }));
        }

        //Handle first prompt.
        if(currentPromptIndex == 0){
            panel.appendChild(mwfd.SingleClickButton("Next Prompt", function(){
                nextPrompt(false);
            }));
        }

        //Handle submit page.
        else if(submitPage){
           panel.appendChild(mwfd.DoubleClickButton("Previous", previousPrompt, "Submit", done));

        //Handle prompts in the middle.
        } else{
            panel.appendChild(mwfd.DoubleClickButton("Previous", previousPrompt, "Next", function(){
                nextPrompt(false);
            }));
        }

       return panel;
    }

    /**
     * Buffer that stores currently displayed/rendered prompts.
     */
    var promptBuffer = {};

    var render = function(){

        //Clear the current contents of the main container.
        container.innerHTML = "";

        //Render prompt if not at the last prompt.
        if(currentPromptIndex < prompts.length) {

            //Dislpayed buffered prompts if possible, else render the prompt and
            //save the rendered content.
            if(!promptBuffer[getCurrentPrompt().getID()]){
                container.appendChild(promptBuffer[getCurrentPrompt().getID()] = getCurrentPrompt().render());
            }else{
                container.appendChild(promptBuffer[getCurrentPrompt().getID()]);
            }

            container.appendChild(getControlButtons(false));

        //Render submit page if at the last prompt.
        } else {

              var menu = mwfd.Menu('Survey Completed');
              menu.addMenuTextItem('Done with ' + survey.getTitle());
              container.appendChild(menu);
              container.appendChild(getControlButtons(true));
        }

    }

    /**
     * Fetches the current location and renders the first prompt.
     *
     * @param callback Function that will be invoked when the survey has been
     *                 completed.
     */
    this.start = function(callback){
        //Update survey response geolocation information.
        surveyResponse.setLocation();

        //Render the initial prompt.
        render();

        //Save the callback to be invoked when the survey has been completed.
        surveyDoneCallback = callback;

    };

    /**
     * Aborts the current survey participation and deletes the users responses.
     * This method should be called to do the clean up before the user navigates
     * to another page without completing the survey. If this method is not
     * invoked,
     */
    this.abort = function(){
        if(surveyResponse != null && !surveyResponse.isSubmitted()){
            SurveyResponse.deleteSurveyResponse(surveyResponse);
        }
    };
}






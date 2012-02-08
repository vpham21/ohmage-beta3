


function Navigation(survey, container)
{

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
        surveyResponse.submit();

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
        container.appendChild(me.getCurrentPrompt().render());
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

            surveyResponse.respond(prompt.getID(),
                                   SurveyResponse.SKIPPED_PROMPT_VALUE);

            return true;

        }


        //Handle invalid responses.
        if(!prompt.isValid())
        {
            alert(prompt.getErrorMessage());

            return false;
        }


        //Save the response.
        surveyResponse.respond(prompt.getID(), prompt.getResponse());

        return true;
    }
}






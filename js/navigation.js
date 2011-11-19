
function PromptNav(prompts, promptDiv)
{
    
    if(prompts.length == undefined)
    {
        prompts = [prompts];
    }
        
    /**
     * This variable utilizes JavaScript's closure paradigm to allow private
     * methods to invoke public methods. 
     */
    var me = this;
   
    /**
     * Instance of prompt generator for the specified prompt div. Use this to 
     * display prompts in a given div and also use this to see if a prompt type
     * is supported.
     */
    var promptGen = new PromptGen(promptDiv);
    
    /**
    * Stores the index of the currently displayed prompt. Initialized to the
    * first prompt.
    */
    var currentPromptIndex = 0;

    /**
    * Next button that navigates to the next prompt.
    */
    var nextButton = $("#next_button");
    
    /**
     * Previous button that navigates to the previous prompt.
     */
    var prevButton = $("#prev_button");
    
    /*
     * Skip button that allows the user to skip a prompt. Initially, this button
     * is invisable, and is only enabled when the prompt is skipable. 
     */
    var skipButton = $("#skip_button");
    
   
    /**
     * Enables or disables next, previous, and skip buttons. This method is also
     * responsible for attaching the correct event handler for each button.
     */
    function updateControlButtons()
    {
        if(currentPromptIndex == 0)
        {
            //ToDo: Somehow disable the previous button.
        }
        
        //Ge the current prompt.
        var currentPrompt = me.getCurrentPrompt();
        
        //If the prompt is skippable, then enable the skip button and add an
        //event handler of the button.
        if(currentPrompt.skippable == "true")
        {
            skipButton.text(currentPrompt.skiplabel);
            skipButton.show();
            skipButton.click(function() {
                me.skipPrompt();
            });
        }
        
        nextButton.click(function() {
           me.nextPrompt();
        });
        
        prevButton.click(function() 
        {  
            me.prevPrompt();
        });
    }
    
    /**
     * Returns currently displayed prompt.
     */
    this.getCurrentPrompt = function()
    {
        return prompts[currentPromptIndex];
    }
    
    
    /**
     * Displays the next prompt, if availabe.
     */
    this.nextPrompt = function()
    {
        currentPromptIndex ++; 
        me.displayPrompt(); 
    }
    
    /**
     * Displays the previous prompt, if available.
     */
    this.prevPrompt = function()
    {
        currentPromptIndex --; 
        me.displayPrompt(); 
    }
    
     /**
     * Goes to the next available prompt. This is very similar to the function 
     * this.nextPrompt() but might change in the future.
     */ 
    this.skipPrompt = function()
    {
       me.nextPrompt();
    }
    
    
    /**
     * Initially, validates data and if validation is passed, submit the prompt
     * data and goes to the next prompt.
     */
    this.submitPrompt = function()
    {
        
    }
    
    /**
     * Fetches and invokes the prompt generator for the current prompt's type.
     * The user will be notified of an error, if the prompt type is not
     * supported. 
     * 
     * Arguments passed to the prompt generator are the actual prompt and the
     * div element that would parent the prompt. 
     */
    this.displayPrompt = function()
    {
        
        
        //Get the current prompt to display.
        var prompt = this.getCurrentPrompt();
        
        console.log(prompt);
    
        
        //If the prompt type is supported, then display the prompt view. 
        if(PromptGen.isPromptSupported(prompt.prompttype))
        {
           
            
            console.log(promptGen);
            //Generate the prompt.
            promptGen.genPrompt(prompt);
            
            //Adjust the functionality of next and previous buttons.
            updateControlButtons();
        }

        //If the prompt type is not supported, alert the user.
        //ToDo: This is stupid - a better approach for error handling is required.
        else
        {
            alert("Prompt type is not supported.");
            me.skipPrompt();
        }
        
        
       
    }
    


    
    

    
    
    
    
    
}






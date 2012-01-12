function Prompt(prompt)
{ 
    
   /**
    * This variable utilizes JavaScript's closure paradigm to allow private
    * methods to invoke public methods. 
    */
    var me = this;
    
    /**
     * Stores error message in case validation fails.
     */
    var errorMsg = null;
    
    /**
     * Default handler for the current prompt.
     */
    var handler = new PromptHandler(this);
    
    /**
    * Default validator for this prompt. Each individual prompt type should 
    * override this method. By default, every response is valid.
    * 
    * @return True.
    */
    this.isValid = function(){
        return true;
    }
    
    /**
     * Returns validation error message or false if none. If this method is
     * called without calling isValid on the current prompt, then isValid will
     * be automatically called before retreiving the error message.
     */
    this.getErrorMessage = function()
    {
        if(errorMsg === null)
            isValid();
        
        return (errorMsg)? errorMsg : false;
    }
    
    /**
     * Set an error message for the current prompt.
     * @param message The new error message.
     */
    this.setErrorMessage = function(message)
    {
        errorMsg = message;
    }
    
    /**
     * Returns the default response for this prompt. Each individual prompt type
     * should override this method in order to return the correct response.
     */
    this.getResponse = function() {
        return this.getDefaultValue();
    }
    
    /**
     * Returns the ID of the current prompt.
     * @return The ID of the current prompt.
     */
    this.getID = function(){
        return prompt.id;
    }
    
    /**
     * Returns the type of the current prompt.
     * @return the type of the current prompt.
     */
    this.getType = function(){
        return prompt.prompttype;
    }
    
    /**
     * Returns a list of properties for this prompt. If the prompt does not 
     * include any properties, then an empty array will be returned.
     */
    this.getProperties = function(){
        return (prompt.properties)? prompt.properties.property : 
                                    ((prompt.properties = {}).property = []);
    }

    /**
     * Returns text related to this prompt. If prompt text is undefined, then an
     * empty string will be returned.
     */
    this.getText = function(){
        return prompt.prompttext || "";
    }
    
    /**
     * Returns true if the prompt may be skipped.
     * @return true if the prompt may be skipped.
     */
    this.isSkippable = function(){
        return prompt.skippable == "true";
    }
    
    this.getSkipLabel = function(){
        return prompt.skiplabel;
    }
 
    /**
     * Returns minimum value allowed for the current prompt's response, or null
     * if the minimum value is undefined.
     * 
     * @return minimum value allowed for the current prompt's response, or null
     *         if undefined.
     */
    this.getMinValue = function()
    {
        var properties = this.getProperties();
        
        for(var i = 0; i < properties.length; i++)
            if(properties[i].key == 'min')
                return properties[i].label;
        
        return null;
    }
    
    /**
     * Returns maximum value allowed for the current prompt's response, or null
     * if the maximum value is undefined.
     * 
     * @return maximum value allowed for the current prompt's response, or null
     *         if undefined.
     */
    this.getMaxValue = function()
    {
        var properties = this.getProperties();
        
        for(var i = 0; i < properties.length; i++)
            if(properties[i].key == 'max')
                return properties[i].label;
        
        return null;
    }
    
    /**
     * Returns the default value for this prompt.
     * @return Default value for this prompt.
     */
    this.getDefaultValue = function()
    {
        //Access the default value of the prompt with array accessing schema
        //in order to bypass JS keyword use 'default'.
        return prompt['default'] || null;
    }
    
   
   /**
    * Adds a new property to this prompt.
    */
   this.addProperty = function(label, key)
    {
        //By default, property key is the index of the array.
        var property = {key:key || me.getProperties().length, label:label};
        
        me.getProperties().push(property);
        
        return property;
    }
    
    /**
     * Returns true if rendering for the current prompt is supported.
     * @return true if rendering for the current prompt is supported; false,
     *         otherwise.
     */
    this.renderSupported = function(){
       return typeof handler[this.getType()] === 'function';
    }

    this.render = function() {
        return (this.renderSupported())? handler[this.getType()]() :   
                                         handler['unsupported']();
    }


    
   
}


/**
 * PromptHandler is responsible for rendering individual prompts and also 
 * overriding prompt.getResponse() and prompt.isValid().
 */
function PromptHandler(prompt)
{
    /**
    * Namespace abbreviation for Mobile Web Framework JS Decorators library.
    */
    var mwfd = mwf.decorator;

    this.single_choice = function(isCustom)
    {
        var choiceMenu = createChoiceMenu(true, isCustom);
        
        prompt.isValid = function()
        {
            if(choiceMenu.getSelectedOptions().length != 1)
            {
                prompt.setErrorMessage("Please select a single option.");
                return false;
            }
           
            return true;

        }
        
        return choiceMenu;

    }
    
    this.multi_choice = function(isCustom)
    {
        var choiceMenu = createChoiceMenu(false, isCustom);
        
        prompt.isValid = function()
        {
            if(choiceMenu.getSelectedOptions().length > 0)
            {
                prompt.setErrorMessage("Please select an option.");
                return false;
            }
           
            return true;
        }
        
        return choiceMenu;
    }
    
    
    this.single_choice_custom = function()
    {
        return createCustomChoiceMenu(this.single_choice(true), true);
    }
    
    this.multi_choice_custom = function()
    {   
        return createCustomChoiceMenu(this.multi_choice(true), false);
    }
    
    var createChoiceMenu = function(isSingleChoice, isCustom)
    {
        var properties = prompt.getProperties();
           
        var menu = mwfd.Menu(prompt.getText());
        
        for(var i = 0; i < properties.length; i++)
        {   
            //Handle single choice prompts.
            if(isSingleChoice)
            {
                menu.addMenuRadioItem(prompt.getType(),      //Name
                                      properties[i].key,     //Value
                                      properties[i].label);  //Label
            }
            
            //Handle multiple choice prompts.
            else
            {
                menu.addMenuCheckboxItem(prompt.getType(),     //Name
                                         properties[i].key,    //Value
                                         properties[i].label); //Label
            }
            
        }
        
                
        prompt.getResponse = function()
        {
            var type = (isCustom) ? 'label' : 'value';
            
            if(isSingleChoice)
            {
                return (menu.getSelectedOptions())[0][type];
            }
            else
            {
                var responses = [];
                var selection = menu.getSelectedOptions();
            
                for(var i = 0; i < selection.length; i++)
                {
                    responses.push(selection[i][type])
                }
        
                return responses;
            }
            
        };
        
        return menu;
        
    }
    
    var createCustomChoiceMenu = function(choice_menu, isSingleChoice)
    {
        
        //Add an option in the menu for creating new options.
        choice_menu.addMenuIconItem('Add custom option', null, 'img/plus.png');

        choice_menu.getLastMenuItem().onclick = function(){
            form.style.display = 'block';
        };
        
        //Create the form for allowing the user to add a new option.
        var form = mwfd.Form('Custom Choice');
        
        //By default the custom choice form is hidden.
        form.style.display = 'none';
        
        //Add a new text box input field for specifying the new choice.
        form.addTextBox('new-choice', 'new-choice');
        
        form.addSubmitButton('Create New Choice', function(e)
        {
            //e.cancelBubble is supported by IE - this will kill the bubbling process.
            e.cancelBubble = true;
            e.returnValue = false;

            //e.stopPropagation works only in Firefox.
            if (e.stopPropagation) {
                e.stopPropagation();
                e.preventDefault();
            }

            var newChoice = document.getElementById('new-choice').value;

            var addOptionItem = choice_menu.getLastMenuItem();

            choice_menu.removeMenuItem(addOptionItem);

            var prop = prompt.addProperty(newChoice);
            
            //Depending on if the choices are single-choice or multiple-choice,
            //add either a radio button menu item or a checkbox menu item.
            if(isSingleChoice){
                choice_menu.addMenuRadioItem(prompt.getType(), prop.key, prop.label);
            }else{
                choice_menu.addMenuCheckboxItem(prompt.getType(), prop.key, prop.label);
            }
            
            choice_menu.addMenuItem(addOptionItem, true);

            //Hide the 'add option button'.
            form.style.display = 'none';
            
            //Clear the user input textbox.
            document.getElementById('new-choice').value = "";
            
            return false;
        });
        
        //This continer will hold both prexisting options and the new option 
        //form.
        var container = document.createElement('div');
        container.appendChild(choice_menu);
        container.appendChild(form);
        return container;
    }
    


    
    this.hours_before_now = function()
    {
        return number();
    }
    
    this.number = function()
    { 
       
        //Create the actual number counter field.
        var count = document.createElement('p');
        count.className = 'number-counter';
        
        //Set the default value. If the default value for the current prompt is
        //not specified, then set it to 0.
        count.innerHTML = prompt.getDefaultValue() || '0';
        
        //Get the minimum and maximum allowed values for this number prompt. It
        //is assumed that these values might be nulls.
        var maxValue = prompt.getMaxValue();
        var minValue = prompt.getMinValue();
        

        //Create the plus sign.
        var plus = document.createElement('p');
        plus.innerHTML = '+';
   
        
        //Create the minus sign.
        var minus = document.createElement('p');
        minus.innerHTML = '-';
        
        
        var updateSignStyle = function()
        {
            //Get the integerer representation of the current value.
            var currentValue = parseInt(count.innerHTML);
        
            plus.className = (currentValue < maxValue)? 'math-sign' : 
                                                        'math-sign-disabled';
                                                
            minus.className = (currentValue > minValue)? 'math-sign' : 
                                                         'math-sign-disabled';
        };
        
        updateSignStyle();
        
        var menu = mwfd.Menu(prompt.getText());

        //Add the plus sign to the menu and configure the click event handler 
        //for this item.
        menu.addMenuItem(plus).onclick = function(e)
        {
            var currentValue = parseInt(count.innerHTML);
            
            if(currentValue < maxValue){
                count.innerHTML =  currentValue + 1;
            }
            
            updateSignStyle();
      
        };
        
        //Add the counter for the menu.
        menu.addMenuItem(count);
        
        //Add the minus sign to the menu and configure the click event handler 
        //for this item.
        menu.addMenuItem(minus).onclick = function(e)
        {
            var currentValue = parseInt(count.innerHTML);
            
            if(currentValue > minValue){
                count.innerHTML =  currentValue - 1;
            }
            
            updateSignStyle();
                
        };
        
        prompt.getResponse = function()
        {
            return parseInt(count.innerHTML);
        };
        
        return menu;
    }

    this.text = function()
    {
        //Get the minimum and maximum text length allowed values for this
        //prompt. It is assumed that these values might be nulls.
        var maxValue = prompt.getMaxValue();
        var minValue = prompt.getMinValue();
        
        var form = mwfd.Form(prompt.getText());
        
        var textarea = document.createElement('textarea');
        
        form.addItem(textarea);
        
        prompt.isValid = function()
        {
            //Remove any heading or trailing white space.
            textarea.value = textarea.value.replace(/^\s+|\s+$/g,"");
            
            //Get the length of the user input text.
            var inputLength = textarea.value.length;
            
            if(inputLength < minValue){
                prompt.setErrorMessage("Please enter text more than " + minValue + " characters in length.");
                return false;
            }
            
            if(inputLength > maxValue){
                prompt.setErrorMessage("Please enter text no longer than " + maxValue + " characters.");
                return false;
            }
            
            return true;  
        };
        
        prompt.getResponse = function()
        {
            //Removes white space from the response and returns it.
            return textarea.value.replace(/^\s+|\s+$/g,"");
        };
        
        return form;
        
    }
    
    this.photo = function()
    {
        return mwfd.SingleButton(prompt.getText());
    }
    
    this.timestampp = function()
    {
        var menu = mwfd.Menu(prompt.getText());

        
        return menu;
        
    }
    
    
    this.unsupported = function()
    {
        var menu = mwfd.Menu(prompt.getText());
        
        menu.addMenuTextItem("Unfortunatly current prompt type is not supported.");
        
        prompt.getResponse = function()
        {
            return SurveyResponse.NOT_DISPLAYED_PROMPT_VALUE;
        };
        
        return menu;
    }

}
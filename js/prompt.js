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
    * Mapping between prompt type and prompt generating function. 
    * 
    * The mapping also allows determining if a prompt type is supported.
    */
    var promptGenerators = 
    {
        "hours_before_now"     : hours_before_now,
        
        "single_choice"        : single_choice,
        
        "single_choice_custom" : single_choice_custom,
        
        "multi_choice"         : multi_choice,
        
        "multi_choice_custom"  : multi_choice_custom,
        
        "timestamp"            : timestamp,
        
        "number"               : number,
        
        "text"                 : text,
        
        "photo"                : photo

    }; 
    
   
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
            this.isValid();
        
        return (errorMsg)? errorMsg : false;
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
    
    this.isSkippable = function(){
        return prompt.skippable == "true";
    }
    
    this.getSkipLabel = function(){
        return prompt.skiplabel;
    }
    
    this.getMinValue = function()
    {
        var properties = this.getProperties();
        
        for(var i = 0; i < properties.length; i++)
            if(properties[i].key == 'min')
                return properties[i].label;
        
        return null;
    }
    
    this.getMaxValue = function()
    {
        var properties = this.getProperties();
        
        for(var i = 0; i < properties.length; i++)
            if(properties[i].key == 'max')
                return properties[i].label;
        
        return null;
    }
    
    /**
     * Returns true if rendering for the current prompt is supported.
     */
    this.renderSupported = function(){
        return promptGenerators[this.getType()] != undefined;
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
    
    this.render = function() {
        return (this.renderSupported())? promptGenerators[this.getType()]() : null;
    }

    this.addProperty = function(label, key)
    {
        //By default, property key is the index of the array.
        var property = {key:key || me.getProperties().length, label:label};
        
        me.getProperties().push(property);
        
        return property;
    }
    
    function hours_before_now()
    {
        return number();
    }
    
    function single_choice(isCustom)
    {
        var choice_menu = createChoiceMenu(true, isCustom);
        
        me.isValid = function()
        {
            return choice_menu.getSelectedOptions().length == 1;   
        }
        
        return choice_menu;

    }
    
    function multi_choice(isCustom)
    {
        var choice_menu = createChoiceMenu(false, isCustom);
        
        me.isValid = function()
        {
            return choice_menu.getSelectedOptions().length > 0;   
        }
        
        return choice_menu;
    }
    

    function single_choice_custom()
    {
        return createCustomChoiceMenu(single_choice(true), true);
    }
    
    function multi_choice_custom()
    {   
        return createCustomChoiceMenu(multi_choice(true), false);
    }
    
    var createCustomChoiceMenu = function(choice_menu, isSingleChoice)
    {
        
        //Add an option in the menu for creating new options.
        choice_menu.addMenuIconItem('Add custom option', null, 'img/plus.png');

        choice_menu.getLastMenuItem().onclick = function(){
            form.style.display = 'block';
        };
        
        //Create the form for allowing the user to add a new option.
        var form = mwf.decorator.Form('Custom Choice');
        
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

            var prop = me.addProperty(newChoice);
            
            //Depending on if the choices are single-choice or multiple-choice,
            //add either a radio button menu item or a checkbox menu item.
            if(isSingleChoice){
                choice_menu.addMenuRadioItem(me.getType(), prop.key, prop.label);
            }else{
                choice_menu.addMenuCheckboxItem(me.getType(), prop.key, prop.label);
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
    

    var createChoiceMenu = function(isSingleChoice, isCustom)
    {
        var properties = me.getProperties();
           
        var menu = mwf.decorator.Menu(me.getText());
        
        for(var i = 0; i < properties.length; i++)
        {   
            //Handle single choice prompts.
            if(isSingleChoice)
            {
                menu.addMenuRadioItem(me.getType(),          //Name
                                      properties[i].key,     //Value
                                      properties[i].label);  //Label
            }
            //Handle multiple choice prompts.
            else
            {
                menu.addMenuCheckboxItem(me.getType(),         //Name
                                         properties[i].key,    //Value
                                         properties[i].label); //Label
            }
            
        }
        
                
        me.getResponse = function()
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
    
    function number()
    { 
       
        //Create the actual number counter field.
        var count = document.createElement('p');
        count.className = 'number-counter';
        
        //Set the default value. If the default value for the current prompt is
        //not specified, then set it to 0.
        count.innerHTML = me.getDefaultValue() || '0';
        
        //Get the minimum and maximum allowed values for this number prompt. It
        //is assumed that these values might be nulls.
        var maxValue = me.getMaxValue();
        var minValue = me.getMinValue();
        

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
        
        var menu = mwf.decorator.Menu(me.getText());

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
        
        me.getResponse = function()
        {
            return parseInt(count.innerHTML);
        };
        
        return menu;
    }

    function text()
    {
        //Get the minimum and maximum text length allowed values for this
        //prompt. It is assumed that these values might be nulls.
        var maxValue = me.getMaxValue();
        var minValue = me.getMinValue();
        
        var form = mwf.decorator.Form(me.getText());
        
        var textarea = document.createElement('textarea');
        
        form.addItem(textarea);
        
        me.isValid = function()
        {
            //Remove any heading or trailing white space.
            textarea.value = textarea.value.replace(/^\s+|\s+$/g,"");
            
            //Get the length of the user input text.
            var inputLength = textarea.value.length;
            
            if(inputLength < minValue){
                errorMsg = "Please enter text more than " + minValue + " characters in length.";
                return false;
            }
            
            if(inputLength > maxValue){
                errorMsg = "Please enter text no longer than " + maxValue + " characters.";
                return false;
            }
            
            return true;  
        };
        
        me.getResponse = function()
        {
            return textarea.value.replace(/^\s+|\s+$/g,"");
        };
        
        return form;
        
    }
    
    function photo()
    {
        
        container.append(MWFLib.createSingleButton(prompt.prompttext, null));
    }
    
    function timestamp()
    {
        var menu = mwf.decorator.Menu(me.getText());
        
        menu.addMenuRadioItem('timestamp', 'value', 'Past Hour');
        menu.addMenuRadioItem('timestamp', 'value', 'Past Few Hours');
        menu.addMenuRadioItem('timestamp', 'value', 'Within Past Day');
        menu.addMenuRadioItem('timestamp', 'value', 'Within Last Few Days');
        menu.addMenuRadioItem('timestamp', 'value', 'Past Week');
        menu.addMenuRadioItem('timestamp', 'value', 'Past Month');
        menu.addMenuRadioItem('timestamp', 'value', 'Past Months');
        menu.addMenuRadioItem('timestamp', 'value', 'Years Ago');
        
        return menu;
        
    }

}
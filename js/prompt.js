function Prompt(prompt)
{ 
   /**
    * This variable utilizes JavaScript's closure paradigm to allow private
    * methods to invoke public methods. 
    */
   var me = this;
    
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
    this.validate = function(){
        return true;
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
    
    this.renderSupported = function(){
        return promptGenerators[this.getType()] != undefined;
    }
    
    /**
     * Returns the default value for this prompt.
     * @return Default value for this prompt.
     */
    this.getDefaultValue = function()
    {
        return prompt['default'];
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
    
    function single_choice()
    {
        
        var properties = me.getProperties();

        var menu = mwf.decorator.Menu(me.getText());
        
        for(var i = 0; i < properties.length; i++)
        {   
            menu.addMenuRadioItem(me.getType(),          //Name
                                  properties[i].key,     //Value
                                  properties[i].label);  //Label
        }
        
        me.getResponse = function()
        {
            return (menu.getSelectedOptions())[0].value;
        };
        
        me.validate = function()
        {
            return me.isSkippable() || menu.getSelectedOptions().length == 1;   
        }
        
        return menu;

    }

    function single_choice_custom()
    {
        return custom_choice_form(single_choice(), true);
    }
    
    function multi_choice_custom()
    {
        return custom_choice_form(multi_choice(), false);
    }
    
    function custom_choice_form(choice_menu, isSingleChoice)
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
            return false;
        });
        
        //This continer will hold both prexisting options and the new option 
        //form.
        var container = document.createElement('div');
        container.appendChild(choice_menu);
        container.appendChild(form);
        return container;
    }
    

    
    function multi_choice()
    {
        var properties = me.getProperties();

        var menu = mwf.decorator.Menu(me.getText());
        
        for(var i = 0; i < properties.length; i++)
        {   
            menu.addMenuCheckboxItem(me.getType(), 
                                     properties[i].key, 
                                     properties[i].label);
        }

        return menu;
    }
    
    function number()
    { 
        var menu = mwf.decorator.Menu(me.getText());
        
        var plus = document.createElement('p');
        plus.innerHTML = '+';
        plus.align = 'center';
        plus.style.color = '#2685BB';
        
        var minus = document.createElement('p');
        minus.innerHTML = '-';
        minus.align = 'center';
        minus.style.color = '#2685BB';
        
        var count = document.createElement('p');
        count.align = 'center';
        
        //Set the default value. If the default value for the current prompt is
        //not specified, then set it to 0.
        count.innerHTML = me.getDefaultValue() || '0';
        
        
        menu.addMenuItem(plus);
        menu.addMenuItem(count);
        menu.addMenuItem(minus);
        
        menu.getMenuItemAt(0).onclick = function(e)
        {
            count.innerHTML = parseInt(count.innerHTML) + 1;
        };
        
        menu.getMenuItemAt(2).onclick = function(e)
        {
            count.innerHTML = parseInt(count.innerHTML) - 1;
        };
        
        me.getResponse = function()
        {
            return parseInt(count.innerHTML);
        }
        
        
        
        return menu;
    }

    function text()
    {
        var form = mwf.decorator.Form(me.getText());
        
        var textarea = document.createElement('textarea');
        
        form.addItem(textarea);
        
        
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
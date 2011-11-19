function Prompt(promptDiv)
{
    
    /**
    * Mapping between prompt type and prompt generating function. 
    * 
    * The mapping also allows determining if a prompt type is supported.
    */
    Prompt.promptGenerators = 
    {
        "single_choice"        : single_choice,
        "single_choice_custom" : single_choice_custom,
        
        "multi_choice"         : multi_choice,
        
        "number"               : number,
        
        "text"                 : text,
        
        "photo"                : photo

    }; 
    
    /**
     * Returns true if the given prompt type is supported, false otherwise.
     * 
     * @param promptType The prompt type (string) to check if it is supported.
     * @return true if the given prompt type is supported, false otherwise.
     */
    Prompt.isPromptSupported = function(promptType)
    {
        return PromptGen.promptGenerators[promptType] != undefined;
    }
    
    /**
     * The method displays the specified prompt. This method should be the 
     * primary use method for this class.
     * 
     * @param prompt The prompt to display.
     */
    this.genPrompt = function(prompt)
    {
        //Before generating a new prompt, clean the prompt view.
        promptDiv.html("");
        
        //Invoke the appropriate prompt generator.
        invoke(PromptGen.promptGenerators[prompt.prompttype], prompt);
    }
    
    
    function single_choice(prompt)
    {

        //Get prompt's properties.
        var properties = prompt.properties.property;

        var menu = $("<div>");
        menu.attr("class", "menu-full menu-detailed menu-padded");
        
        var title = MWFContent.createTitle(prompt.prompttext);
        
        var menuList = $("<ol>");

        for(var i = 0; i < properties.length; i++)
        {   

            var property = properties[i];

            var menuItem = $("<li>");

            //If the list item is the last item in the menu, mark it 
            //with menu-last class for assuring compatability. 
            if(i == properties.length - 1)
            {
                menuItem.attr("class", "menu-last");       
            }

            var menuItemOption = $('<input>');
            menuItemOption.attr("name", "single_choice");
            menuItemOption.attr("value", property.key);
            menuItemOption.attr("type", "radio");
            
            var menuItemLink = $('<a>');
            menuItemLink.append(menuItemOption)
            menuItemLink.append(property.label);
            menuItemLink.click(function() {
                
                $(this).children("input").attr("checked", "checked");
            });
            
            menuItem.append(menuItemLink);
            
            menuList.append(menuItem);

        }






        menu.append(title);
        menu.append(menuList);

        promptDiv.append(menu);




    }

    function single_choice_custom(prompt)
    {


        alert("single choice custom");

    }

    function multi_choice(prompt)
    {

    }
    
    function number(prompt)
    {
        
        var contentDiv = $('<div>');
        contentDiv.attr("class", "content-full content-padded");

        var contentTitle = MWFContent.createTitle(prompt.prompttext);

        var contentPar = $('<p>');
        contentPar.attr("style", "text-align:center;")
       
        contentPar.html("0");

        contentDiv.append(contentTitle);
        contentDiv.append(contentPar);
        
        var changeCounter = function(e)
        {
            
            if(e.currentTarget.innerHTML == '+')
            {
                contentPar.html(parseInt(contentPar.html()) + 1);
            }
            else
            {
                if(parseInt(contentPar.html()) > 0)
                    {
                        contentPar.html(parseInt(contentPar.html()) - 1);
                    }
            }
            
        };

        
        
        promptDiv.append(contentDiv);
        promptDiv.append(MWFLib.createDoubleButton("-", function(e) {changeCounter(e)}, 
                                                   "+", function(e) {changeCounter(e)}));
        

    }

    function text(prompt)
    {
         //Get prompt's properties.
        var properties = prompt.properties.property;


        var title = MWFContent.createTitle(prompt.prompttext);

        
    }
    
    function photo(prompt)
    {
        
        promptDiv.append(MWFLib.createSingleButton(prompt.prompttext, null));
    }
    

   
}
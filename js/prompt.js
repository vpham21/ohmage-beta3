

/**
 *
 * Represents an individual prompt. The class provides functionality for getting
 * the prompt's
 */
function Prompt(prompt){

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
     * Default handler for the current prompt. The handler knows how to display
     * the prompt and analyze the response.
     */
    var handler = new PromptHandler(this);

    this.render = function(){
        return handler.render();
    }

    /**
    * Default validator for this prompt. Each individual prompt type should
    * override this method. By default, every response is valid.
    *
    * @return True.
    *
    */
    this.isValid = function(){
        return true;
    };

    /**
     * Returns validation error message or false if none. If this method is
     * called without calling isValid on the current prompt, then isValid will
     * be automatically called before retreiving the error message.
     */
    this.getErrorMessage = function(){
        if(errorMsg === null){
            isValid();
        }

        return (errorMsg)? errorMsg : false;
    };

    /**
     * Set an error message for the current prompt.
     * @param message The new error message.
     */
    this.setErrorMessage = function(message){
        errorMsg = message;
    };

    /**
     * Returns the default response for this prompt. Each individual prompt type
     * should override this method in order to return the correct response.
     */
    this.getResponse = function() {
        return this.getDefaultValue();
    };

    /**
     * Returns the ID of the current prompt.
     * @return The ID of the current prompt.
     */
    this.getID = function(){
        return prompt.id;
    };

    /**
     * Returns the conditional statement associated with the current prompt.
     */
    this.getCondition = function(){
        return prompt.condition || null;
    }

    /**
     * Returns the type of the current prompt.
     * @return the type of the current prompt.
     */
    this.getType = function(){
        return prompt.prompttype;
    };

    /**
     * Returns a list of properties for this prompt. If the prompt does not
     * include any properties, then an empty array will be returned.
     */
    this.getProperties = function(){

        if(!prompt.properties){
            prompt.properties = {};
        }

        if(!prompt.properties.property){
            prompt.properties.property = [];
        }

        //If there is only a single property, then convert the property variable
        //to an array and add the element.
        if(prompt.properties.property.length == 1){
            var singleElement = prompt.properties.property;
            prompt.properties.property = [];
            prompt.properties.property.push(singleElement);
        }

        return prompt.properties.property;
    };

    /**
     * Returns text related to this prompt. If prompt text is undefined, then an
     * empty string will be returned.
     */
    this.getText = function(){
        return prompt.prompttext || "";
    };

    /**
     * Returns true if the prompt may be skipped.
     * @return true if the prompt may be skipped.
     */
    this.isSkippable = function(){
        return prompt.skippable === "true";
    };

    /**
     * Returns the label that should be displayed inside the skip button.
     */
    this.getSkipLabel = function(){
        return prompt.skiplabel;
    };

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

        for(var i = 0; i < properties.length; i++){
            if(properties[i].key === 'min'){
                return properties[i].label;
            }

        }
        return null;
    };

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

        for(var i = 0; i < properties.length; i++){
            if(properties[i].key === 'max'){
                return properties[i].label;
            }
        }

        return null;
    };

    /**
     * Returns the default value for this prompt.
     * @return Default value for this prompt.
     */
    this.getDefaultValue = function()
    {
        //Access the default value of the prompt with array accessing schema
        //in order to bypass JS keyword use 'default'.
        return prompt.defaultvalue || null;
    };

    /**
     * Detects if the specified property is already in the property list of this
     * prompt. The method returns true if the property is a duplicate, false
     * otherwise.
     */
    var isDuplicatePropertyLabel = function(property){

        var properties = me.getProperties();

        for(var i = 0; i < properties.length; i++)
        {
            if(properties[i].label == property.label){
                return true;
            }
        }

        return false;
    }

   /**
    * Adds a new property to this prompt. If the property label already exists,
    * then the method will have no side effects and will return false.
    */
   this.addProperty = function(label, key)
    {
        //By default, property key is the index of the array.
        var property = {key:key || me.getProperties().length, label:label};

        if(!isDuplicatePropertyLabel(property)){
            me.getProperties().push(property);
            return property;
        }else{
            return false
        }

    };






}










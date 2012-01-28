/**
 * MWF Decorator class for creating and manipulating form elements.
 * 
 * The class does not require JQuery or third party Javascript library, but 
 * depends on mwf.decorator class definition.

 *  
 * @namespace mwf.decorator.Form
 * @dependency mwf.decorator
 * @author zkhalapyan
 * @copyright Copyright (c) 2010-11 UC Regents
 * @license http://mwf.ucla.edu/license
 * @version 20111115
 * 
 */

mwf.decorator.Form = function(title)
{
    
    /**
     * A CSS class name that indicates the first element in a list of elements.
     */
    var FIRST_MARKER = "form-first";
    
    /**
     * A CSS class name that indicates the last element in a list of elements.
     */
    var LAST_MARKER  = "form-last";
    
    var form = document.createElement("form");
    
    var attributes = [
                        new mwf.decorator.Attribute("Padded",   true, "form-padded"),
                        new mwf.decorator.Attribute("Full",     true, "form-full")
                     ];
    
    mwf.decorator.addAttributes(form, attributes);
    
    /**  
     * Sets the title of this form. If the specified title is null or 
     * undefined, then the form's title, if it exists, will be removed.
     * 
     * @param title The title to set.
     */
    form.setTitle = function(title)
    {
        //If current element has a title, then unset it. 
        if(this._title)
        {
            mwf.decorator.remove(this, this._title, FIRST_MARKER, LAST_MARKER);
            this._title = null;
        }
        
        //Set title, if specified.
        if(title)
        {
            //Create a new title to add to the element, and save it in a member 
            //variable.
            this._title = mwf.decorator.Title(title);
            
            //Prepend the new title to the content.
            mwf.decorator.prepend(this, this._title, FIRST_MARKER, LAST_MARKER);
            
            
        }
    }
    
    /**
     * Returns the current elements title if it's set; null otherwise. 
     * @return The current elements title if it's set; null otherwise. 
     */
    form.getTitle = function()
    {
        return (this._title)? this._title : null;
    }
    
    
    /**
     * Prepends an arbitrary DOM element to the current form.
     * 
     * @return This form element.
     */
    form.addItem = function(item)
    {
        mwf.decorator.append(this, item, FIRST_MARKER, LAST_MARKER); 
        
        return this;
    }

    
    /**
     * Appends a new text block element to the current content.
     * 
     * @return This form.
     */
    form.addTextBlock = function(text)
    {   
        //Create a new <p> tag and set its contents to equal the specified text.
        var textBlock = document.createElement('p');
        textBlock.innerHTML = text | "";
        
        return this.addItem(textBlock);

    }
    
    /**
     * Appends a text box with a specified name and ID attributes to the 
     * current form.
     * 
     * @param name The name of the text box input item.
     * @param id The ID of the new text box input item.
     * 
     * @return This form.
     */
    form.addTextBox = function(name, id)
    {
        var textBox = document.createElement('input');
        
        textBox.name = name || null;
        textBox.id   = id || null;
        
        return this.addItem(textBox);
    }
    
    /**
     * Appends a submit button to the current form.
     * 
     * @param text The visible text for the submit button.
     * @param callback The callback function for the submit button's onclick
     *        event listener.
     *        
     * @return This form.
     */
    form.addSubmitButton = function(text, callback)
    {
        var submitButton = document.createElement('input');
        
        submitButton.type = 'submit';
        submitButton.value = text;
        submitButton.onclick = callback || null;
        
        return this.addItem(submitButton);
    }
    
    form.setTitle(title);
   
    return form;
}


mwf.decorator.Form.createTimePicker = function(hours, minutes, seconds)
{
    //Initalize default values of null.
    hours   = hours || null;
    minutes = minutes || null;
    seconds = seconds || null;
    
    var timePicker = mwf.decorator.Form('Time');
    
    var hSelect = FormElement.createSelect(Array.createRange(0, 23), hours);
    var mSelect = FormElement.createSelect(Array.createRange(0, 59), minutes);
    var sSelect = FormElement.createSelect(Array.createRange(0, 59), seconds);
    
    timePicker.appendChild(mwf.decorator.Form.createLabel('Hour:'));
    timePicker.appendChild(hSelect);
    
    timePicker.appendChild(mwf.decorator.Form.createLabel('Minute:'));
    timePicker.appendChild(mSelect);
    
    timePicker.appendChild(mwf.decorator.Form.createLabel('Seconds:'));
    timePicker.appendChild(sSelect);
    
    return timePicker;

}


mwf.decorator.Form.createDatePicker = function(year, month, day)
{
    var date = new Date();
    
    function getDaysInMonth(month, year){
        return 32 - new Date(year, month, 32).getDate();
    }

    var months = [
        "January", 
        "February", 
        "March", 
        "April", 
        "May", 
        "June", 
        "July", 
        "August", 
        "September", 
        "October", 
        "November", 
        "December"
    ];
    
    var datePicker = mwf.decorator.Form('Date');
    
    //Change the default month, if set, to english representation. 
    month = (month)? months[month] : null;
    
    var mSelect = FormElement.createSelect(months, month);
    
    
    //If the user has specified a default year and month, then determine the 
    //number of days in the month to be displayed. 
    var daysInMonth = (year && month) ? getDaysInMonth(year, month) : 31;
    
    var dSelect = FormElement.createSelect(Array.createRange(1, daysInMonth), day);
    
    var ySelect = FormElement.createSelect(Array.createRange(date.getFullYear() - 10, date.getFullYear() + 10));
    
    datePicker.appendChild(mwf.decorator.Form.createLabel('Month:'));
    datePicker.appendChild(mSelect);
    
    datePicker.appendChild(mwf.decorator.Form.createLabel('Day:'));
    datePicker.appendChild(dSelect);
    
    datePicker.appendChild(mwf.decorator.Form.createLabel('Year:'));
    datePicker.appendChild(ySelect);
    
    return datePicker;
}

var FormElement = function(){}

FormElement.createSelect = function(options, selected)
{
    var select = document.createElement('select');
    select.type = 'text';
    
    for(var i = 0; i < options.length; i++)
    {
        var optionTag = document.createElement('option');
        
        optionTag.value = options[i];
        optionTag.innerHTML = options[i];
        
        if(options[i] == selected){
            optionTag.selected = selected;
        }   
            
        select.appendChild(optionTag);
    }
    
    return select;

}

/**
 * Creates a number array that ranges from [start, stop].
 * 
 * @param start int
 * @param stop int 
 */
Array.createRange = function(start, stop)
{
    var list = [];

    for(var i = start; i <= stop; i++){
        list.push(i);
    }

    return list;
}

mwf.decorator.Form.createLabel = function(text)
{
    var labelTag = document.createElement('label');
    labelTag.innerHTML = text;
    return labelTag;
}

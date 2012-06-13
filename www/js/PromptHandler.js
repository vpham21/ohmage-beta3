

/**
 * PromptHandler is responsible for rendering individual prompts and also
 * overriding prompt.getResponse() and prompt.isValid(), as appropriate.
 */
function PromptHandler(prompt){

    /**
     * Returns true if rendering for the current prompt is supported.
     * @return true if rendering for the current prompt is supported; false,
     *         otherwise.
     */
    this.renderSupported = function(){
       return typeof handlers[prompt.getType()] === 'function';
    };

    /**
     *
     */
    this.render = function() {
        return (this.renderSupported())? handlers[prompt.getType()](prompt) :
                                         handlers.unsupported(prompt);
    };
}

PromptHandler.Handlers = function(){

    /**
     * Namespace abbreviation for Mobile Web Framework JS Decorators library.
     */
    var mwfd = mwf.decorator;

    var createChoiceMenu = function(prompt, isSingleChoice, isCustom){

        var properties = prompt.getProperties();

        var menu = mwfd.Menu(prompt.getText());

        for(var i = 0; i < properties.length; i++){

            //Handle single choice prompts.
            if(isSingleChoice){
                menu.addMenuRadioItem(prompt.getType(),      //Name
                                      properties[i].key,     //Value
                                      properties[i].label);  //Label

            //Handle multiple choice prompts.
            } else {
                menu.addMenuCheckboxItem(prompt.getType(),     //Name
                                         properties[i].key,    //Value
                                         properties[i].label); //Label
            }

        }


        prompt.getResponse = function(){

            var type = (isCustom) ? 'label' : 'value';

            if(isSingleChoice){
                return (menu.getSelectedOptions())[0][type];

            } else {
                var responses = [];
                var selection = menu.getSelectedOptions();

                for(var i = 0; i < selection.length; i++){
                    responses.push(selection[i][type]);
                }

                return responses;
            }

        };

        return menu;

    };

    var createCustomChoiceMenu = function(prompt, choice_menu, isSingleChoice){

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

        form.addSubmitButton('Create New Choice', function(e){

            //e.cancelBubble is supported by IE - this will kill the bubbling process.
            e.cancelBubble = true;
            e.returnValue = false;

            //e.stopPropagation works only in Firefox.
            if (e.stopPropagation){
                e.stopPropagation();
                e.preventDefault();
            }

            //Get the value specified by the user.
            var newChoice = document.getElementById('new-choice').value;

            if(newChoice.length == 0){
                showMessage('Please specify an option to add.');
                return false;
            }

            //Create a new property with the value specified.
            var prop = prompt.addProperty(newChoice);

            //If the property is invalid, alert the user and cancel the add.
            if(!prop){
                showMessage('Option with that label already exists.');
                return false;
            }

            var addOptionItem = choice_menu.getLastMenuItem();

            choice_menu.removeMenuItem(addOptionItem);

            //Depending on if the choices are single-choice or multiple-choice,
            //add either a radio button menu item or a checkbox menu item.
            if(isSingleChoice){
                choice_menu.addMenuRadioItem(prompt.getType(), prop.key, prop.label);
            }else{
                choice_menu.addMenuCheckboxItem(prompt.getType(), prop.key, prop.label);
            }

            //Hide the 'add option button'.
            form.style.display = 'none';

            //Clear the user input textbox.
            document.getElementById('new-choice').value = "";

            choice_menu.addMenuItem(addOptionItem, true);

            return false;
        });

        //This continer will hold both prexisting options and the new option
        //form.
        var container = document.createElement('div');
        container.appendChild(choice_menu);
        container.appendChild(form);
        return container;
    };


    this.single_choice = function(prompt, isCustom){

        var choiceMenu = createChoiceMenu(prompt, true, isCustom);

        prompt.isValid = function(){

            if(choiceMenu.getSelectedOptions().length !== 1){
                prompt.setErrorMessage("Please select a single option.");
                return false;
            }

            return true;

        };

        return choiceMenu;

    };

    this.multi_choice = function(prompt, isCustom){

        var choiceMenu = createChoiceMenu(prompt, false, isCustom);

        prompt.isValid = function(){

            if(choiceMenu.getSelectedOptions().length === 0){
                prompt.setErrorMessage("Please select an option.");
                return false;
            }

            return true;
        };

        return choiceMenu;
    };


    this.single_choice_custom = function(prompt){
        return createCustomChoiceMenu(prompt, this.single_choice(prompt, true), true);
    };

    this.multi_choice_custom = function(prompt){
        return createCustomChoiceMenu(prompt, this.multi_choice(prompt, true), false);
    };

    this.hours_before_now = function(prompt){
        return this.number(prompt);
    };

    this.number = function(prompt){

        //Create the actual number counter field.
        var count = document.createElement('p');
        count.className = 'number-counter';

        //console.log("MIN: " + prompt.getMinValue() + " MAX: " + prompt.getMaxValue() + " DEFAULT: " + prompt.getDefaultValue());

        //Set the default value. If the default value for the current prompt is
        //not specified, then try to use the minimum value. If this is also  then set it to 0.
        if(prompt.getDefaultValue() != null){
            count.innerHTML = prompt.getDefaultValue();
        } else if(prompt.getMinValue() != null){
            count.innerHTML = prompt.getMinValue();
        } else{
            count.innerHTML = "0";
        }

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

        //Either disables or enables the +/- depending on if the value is below
        //or above the allowed range.
        var updateSignStyle = function(){

            //Get the integerer representation of the current value.
            var currentValue = parseInt(count.innerHTML, 10);

            plus.className = (currentValue < maxValue)? 'math-sign' :
                                                        'math-sign-disabled';

            minus.className = (currentValue > minValue)? 'math-sign' :
                                                         'math-sign-disabled';
        };

        updateSignStyle();

        var menu = mwfd.Menu(prompt.getText());

        //Add the plus sign to the menu and configure the click event handler
        //for this item.
        menu.addMenuItem(plus).onclick = function(e){

            var currentValue = parseInt(count.innerHTML, 10);

            if(currentValue < maxValue){
                count.innerHTML =  currentValue + 1;
            }

            updateSignStyle();

        };

        //Add the counter for the menu.
        menu.addMenuItem(count);

        //Add the minus sign to the menu and configure the click event handler
        //for this item.
        menu.addMenuItem(minus).onclick = function(e){

            var currentValue = parseInt(count.innerHTML, 10);

            if(currentValue > minValue){
                count.innerHTML =  currentValue - 1;
            }

            updateSignStyle();

        };

        prompt.getResponse = function(){
            return "" + parseInt(count.innerHTML, 10);
        };

        return menu;
    };

    this.text = function(prompt){

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

    };

    this.photo = function(prompt){

        var container = document.createElement('div');

        var imgForm = mwf.decorator.Form('Image');
        imgForm.style.display = 'none';
        container.appendChild(imgForm);

        //This will store the image preview.
        var image = document.createElement('img');
        image.style.width = "100%";
        imgForm.addItem(image);

        //This is the method that will be called after the user takes a picture
        //or after the user uploads/selects a picture via the file input method.
        var recordImage = function(imageData, encode){

            //Display the capture image.
            image.src =  ((encode) ? "data:image/jpeg;base64," : "") + imageData;
            imgForm.style.display = 'block';

            //Save the image and store the returned UUID within the image's
            //alt attribute.
            image.alt = SurveyResponse.saveImage(imageData);

        };

        //Detect PhoneGap camera support. If possible, allow the user to take a
        //photo.
        if(navigator.camera){
            var takeImageButton = mwfd.SingleClickButton(prompt.getText(), function(){

                function onSuccess(imageData) {
                    recordImage(imageData, true);
                }

                function onFail(message) {
                    showMessage('Failed because: ' + message);
                }

                navigator.camera.getPicture(onSuccess, onFail, { quality: 25,
                    destinationType: Camera.DestinationType.DATA_URL
                });
            });

            container.appendChild(takeImageButton);

        //Downgrade to file input form.
        } else {

            var fileInputForm = mwfd.Form(prompt.getText());

            var fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInputForm.addItem(fileInput);
            fileInput.onchange = function(){

                var input = this.files[0];

                if(input){
                    Base64.getBase64ImageFromInput(input, function(imageData){
                        recordImage(imageData, false);
                    });
                }else{
                    showMessage("Please select an image.");
                }

            }

            container.appendChild(fileInputForm);
        }


        prompt.isValid = function(){

            if(!image.alt){
                prompt.setErrorMessage("Please take an image to submit.");
                return false;
            }

            return true;

        };

        prompt.getResponse = function(){
            return image.alt;
        };

        return container;

    };

    this.timestamp = function(prompt){

        //Regular expression for validating the time component of a timestamp prompt.
        var DATE_REGEX = "[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])";

        //Regular expression for validating the time component of a timestamp prompt.
        var TIME_REGEX = "^(([0-9])|([0-1][0-9])|([2][0-3])):(([0-9])|([0-5][0-9]))$";

        //Left pads 'd' to '0d', if necessary.
        var leftPad = function(number){
            return ((String(number)).length === 1) ? "0" + number : number;
        };

        //Returns YYYY-MM-DD
        var getFullDate = function(date){
            return date.getFullYear() + "-" +
                   leftPad(date.getMonth() + 1) + "-" +
                   leftPad(date.getDate());
        };


        var date = new Date();

        var datePicker = document.createElement('input');
        datePicker.type = 'date';
        datePicker.value = getFullDate(date);

        //Handle browsers that don't support HTML5's input=date.
        //This is kind of a hack since Android browser engine sets the input
        //type to 'date' but doesn't really support it.
        if(datePicker.type === 'text' || navigator.userAgent.match(/(Android)/)){
            $(datePicker).scroller({dateFormat:'yyyy-mm-dd', dateOrder:'yymmdd'});
        }

        var timePicker = document.createElement('input');
        timePicker.type = 'time';
        timePicker.value = leftPad(date.getHours()) + ":" + leftPad(date.getMinutes());

        //Handle browsers that don't support HTML5's input=time.
        if(timePicker.type === 'text'){
            $(timePicker).scroller({preset:'time', ampm: false, timeFormat:'HH:ii'});
        }

        prompt.isValid = function()
        {
            if(!datePicker.value.match(DATE_REGEX)){
                prompt.setErrorMessage("Please specify date in the format: YYYY-MM-DD.");
                return false;

            } else if(!timePicker.value.match(TIME_REGEX)){
                prompt.setErrorMessage("Please specify time in the format: HH-MM.");
                return false;
            }

            return true;
        };

        prompt.getResponse = function()
        {
            return datePicker.value + 'T' + timePicker.value + ":00";
        };


        var form = mwfd.Form(prompt.getText());

        form.addLabel("Select Date");
        form.addItem(datePicker);

        form.addLabel("Select Time");
        form.addItem(timePicker);

        return form;

    };


    this.unsupported = function(prompt){

        var menu = mwfd.Menu(prompt.getText());

        menu.addMenuTextItem("Unfortunatly current prompt type is not supported.");

        prompt.getResponse = function()
        {
            return SurveyResponse.NOT_DISPLAYED_PROMPT_VALUE;
        };

        return menu;
    };
}

var handlers = new PromptHandler.Handlers();
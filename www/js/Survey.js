var Survey = function(survey, campaign){

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
     * Renders the current survey within the provided container. This method can
     * be used to both display a summary of the survey, like in the upload queue
     * and display a starting page of the survey. In order to disable the start
     * button, set the second paramter to false.
     *
     * @param container The container to store the survey rendering.
     * @param startButton Boolean value indicating if a survey can be started.
     */
    this.render = function(container, startButton){

        //By default, start button will be displayed.
        if(startButton === undefined){
            startButton = true;
        }

        var content = mwfd.Content();

        content.setTitle(this.getTitle());
        content.addTextBlock(this.getDescription());

        container.appendChild(content);

        //Optionally, display a start button that will initiate the survey.
        if(startButton){

            var startSurvey = mwfd.SingleClickButton('Start Survey', function() {
                me.start(container);
            });

            container.appendChild(startSurvey);
        }


    }

    /**
     * Starts a new navigation object with the current survey. This method
     * should be used to start off the survey. The prompts will be displayed one
     * by one, user response will be gathered in a SurveyResponse, etc.
     */
    this.start = function(container){

        //Callback for when the user completes the survey.
        var onSurveyComplete = function(surveyResponse){

            var title = 'ohmage';
            var buttonLabels = 'Yes,No';
            var message = "Would you like to upload your response?";
            var callback = function(yes){

                //Positive confirmation.
                if(yes){
                    var uploader = new SurveyResponseUploader(me, surveyResponse);

                    uploader.upload(function(response){

                        //Invoked after displaying a message to the user i.e. alert.
                        var callback = function(){
                            PageNavigation.openCampaignView(me.getCampaign().getURN());
                        };

                        //On successful survey upload, notify the user and delete
                        //the response.
                        if(response.result === "success"){
                            showMessage("Successfully uploaded your survey response.", callback);
                            SurveyResponse.deleteSurveyResponse(surveyResponse);

                        //On a failed survey response upload, notify the user with
                        //an error message.
                        }else{
                            showMessage(response.errors[0].text, callback);
                        }
                    });

                }else{                  
                    PageNavigation.openCampaignView(me.getCampaign().getURN());
                }
            }

            showConfirm(message, callback, buttonLabels, title);
        };

        //Start the actual survey.
        new Navigation(this, container).start(onSurveyComplete);
    }

    /**
     * Returns the title of the current survey.
     * @return Current survey's title, or empty string if undefined.
     */
    this.getTitle = function(){
        return survey.title || "";
    }

    /**
     * Returns the description of the current survey.
     * @return Current survey's description, or emptry string if undefined.
     */
    this.getDescription = function(){
        return survey.description || "";
    }

    /**
     * Returns the ID of the current survey.
     * @return Current survey's ID.
     */
    this.getID = function(){
        return survey.id;
    }

    /**
     * Returns a reference to this survey's campaign.
     * @return Reference to this survey's campaign.
     */
    this.getCampaign = function(){
        return campaign;
    }

    /**
     * Returns an array of prompt objects associated with this survey.
     */
    this.getPrompts = function(){

        var promptList = survey.contentlist.prompt;

        if(promptList.length){

            var prompts = new Array();

            for(var i = 0; i < promptList.length; i++){
                prompts[i] = new Prompt(promptList[i]);
            }

            return prompts;
        } else {
            return [new Prompt(promptList)];
        }

    };

    this.getPrompt = function(id){

        var prompts = this.getPrompts();

        for(var i = 0; i < prompts.length; i++){
            if(prompts[i].getID() == id){
                return prompts[i];
            }
        }

        return null;
    };
}

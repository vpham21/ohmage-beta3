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
     * Starts a new navigation object with the current survey.
     */
    this.start = function(container){

        new Navigation(this, container).start(function(surveyResponse){

            var message = "Would you like to upload your response?";
            if(confirm(message)){
                var uploader = new SurveyResponseUploader(me, surveyResponse);

                uploader.upload(function(response){

                    if(response.result === "success"){

                        alert("Successfully uploaded your survey response.");
                        SurveyResponse.deleteSurvey(surveyResponse);
                       
                    }else{
                        alert(response.errors[0].text);
                    }

                    PageNavigation.openCampaignView(me.getCampaign().getURN());

                });

            }else{
                PageNavigation.openCampaignView(me.getCampaign().getURN());
            }



        });
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

        if(promptList.length)
        {
            var prompts = new Array();

            for(var i = 0; i < promptList.length; i++)
            {
                prompts[i] = new Prompt(promptList[i]);
            }

            return prompts;
        }
        else
        {
            return [new Prompt(promptList)];
        }

    };
}


Survey.init = function(campaignURN, surveyID, callback)
{
     Campaign.init(campaignURN, function(campaign)
     {
         callback(campaign.getSurvey(surveyID));
     });
}

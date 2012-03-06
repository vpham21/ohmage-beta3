var Survey = function(survey, campaign)
{
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
     * Returns the title of the current survey.
     * @return Current survey's title, or empty string if undefined.
     */
    this.getTitle = function()
    {
        return survey.title || "";
    }

    /**
     * Returns the description of the current survey.
     * @return Current survey's description, or emptry string if undefined.
     */
    this.getDescription = function()
    {
        return survey.description || "";
    }

    /**
     * Returns the ID of the current survey.
     * @return Current survey's ID.
     */
    this.getID = function()
    {
        return survey.id;
    }

    /**
     * Returns a reference to this survey's campaign.
     * @return Reference to this survey's campaign.
     */
    this.getCampaign = function()
    {
        return campaign;
    }

    /**
     * Returns an array of prompt objects associated with this survey.
     */
    this.getPrompts = function()
    {
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

    }


    this.render = function(container, startButton)
    {
        if(startButton === undefined){
            startButton = true;
        }
        
        var content = mwfd.Content();

        content.setTitle(this.getTitle());
        content.addTextBlock(this.getDescription());


        container.appendChild(content);

        if(startButton){

            var startSurvey = mwfd.SingleClickButton('Start Survey', function() {
                me.start(container);
            });


            container.appendChild(startSurvey);
        }


    }

    this.start = function(container)
    {
        new Navigation(this, container).start(function(response){

            alert('Survey Done - time to send the response.');
            console.log(response);
            openCampaignView(me.getCampaign().getURN());

        });
    }
}


Survey.init = function(campaignURN, surveyID, callback)
{
     Campaign.init(campaignURN, function(campaign)
     {
         callback(campaign.getSurvey(surveyID));
     });
}

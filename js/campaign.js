
/**
 * 
 */
function Campaign(campaign)
{
    this.campaign     = campaign;
    this.campaignXML  = $.xml2json.parser(campaign.xml).campaign;
   
    console.log(this.campaign);
    console.log(this.campaignXML);
    
    /**
     * Returns the URN for this campaign.
     */
    this.getURN = function()
    {
        return this.campaignXML["campaignurn"];
    }
    
    /**
     * Returns the description for this campaign.
     */
    this.getDescription = function()
    {
        return campaign.description;
    }
    
    this.render = function(container)
    {
        
        var surveys = this.getSurveys();
        
        var surveyMenu = mwf.decorator.Menu("Available Surveys");

        //Iterate through each of the campaign's surveys 
        //and add it to the menu. 
        for(var i = 0; i < surveys.length; i++)
        {  
            
            var url = "javascript:openSurveyView(\'" + this.getURN() + 
                      "\', \'" + surveys[i].id + "\')";
            
            surveyMenu.addMenuLinkItem(surveys[i].title, 
                                       url, 
                                       surveys[i].description);
           
        }
        
        container.appendChild(surveyMenu);
    }

    /**
     * Returns surveys associated with this campaign.
     * 
     * --TODO-- all parameter passing should be done via classes. no objects.
     */ 
    this.getSurveys = function()
    {
        //Get the list of surveys from the campaign.
        var surveys  = this.campaignXML.surveys.survey;

        //If survey is returned as a single item, then go ahead and place
        //it in an array. This is a kind of a dirty fix, if you have any 
        //better ideas of approaching the situation - please be my guest. 
        return (!surveys.length)? [surveys] : surveys;
    }
   
  /**
   * Returns a survey associated 
   */
   this.getSurvey = function(id)
   {
       //Get a list of all the possible surveys.
       var surveys = this.getSurveys();
       
       //Iterate through the list of retrieved surveys. If a ID match is found, 
       //return the survey.
       for(var i = 0; i < surveys.length; i++)
       {
          if(surveys[i].id == id)
          {
              return new Survey(surveys[i]);
          }
       }

       //If no match was found, return null.
       return null;
   }
   

   
}

Campaign.init = function(urn, callback)
{
    Campaigns.init(function(campaigns)
    {
       callback(campaigns.getCampaign(urn));
    });
}

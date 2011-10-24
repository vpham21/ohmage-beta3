
/**
 * 
 */
function Campaign(response, campaignURN)
{
  
   this.getCampaignURN = function()
   {
       return campaignURN;
   }
   
   /** 
    * Extracts and returns the campaign with the specified URN from the response.
    */
   this.getCampaign = function()
   {
       //ToDo: Optimize this to only do the conversion once.
       return $.xml2json.parser(response.data[campaignURN].xml).campaign;
   }
   
   /**
    * Extracts and returns a list of surveys from the campaign config XML.
    */ 
   this.getSurveys = function()
   {
        //Get the list of surveys from the campaign.
        var surveys  = this.getCampaign().surveys.survey;

        //If survey is returned as a single item, then go ahead and place
        //it in an array. This is a kind of a dirty fix, if you have any 
        //better ideas of approaching the situatin - please be my guest. 
        if(surveys.length == undefined)
        {
            surveys = [surveys];
        }

        return surveys;
   }
   
  /**
   * Extracts and returns a specific survey from a campaign.
   */
   this.getSurvey = function(surveyID)
   {
       //Get a list of all the possible surveys.
       var surveys = this.getSurveys();
       
       //Iterate through the list of retrieved surveys. If a ID match is found, 
       //return the survey.
       for(var i = 0; i < surveys.length; i++)
       {
          if(surveys[i].id == surveyID)
          {
              return surveys[i];
          }
       }

       //If no match was found, return null.
       return null;
   }
   
   /**
    * Extracts and returns a list of prompts for a given survey.
    */
   this.getPrompts = function(surveyID)
   {
       return getSurvey(response, campaignURN, surveyID).contentlist.prompt;
   }

  /**
   * This method might get encapsulated into a new Prompt object.
   */
   this.getPromptProperties = function(prompt)
   {
       return prompt.properties.property;
   }
   
   
}

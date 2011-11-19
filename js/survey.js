var survey = function()
{
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
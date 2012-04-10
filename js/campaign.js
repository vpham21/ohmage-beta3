
/**
 *
 * @author Zorayr Khalapyan
 */
function Campaign(campaign){

    var me = this;

    /*
     * There is apparently a very weird problem running JavaScript within
     * PhoneGap – the engine is so restrictive that when encountering the word
     * ‘default’, used within the prompt’s XML configuration file as a property
     * storing the default value, it interprets it as a keyword crushing the
     * system. This renders the XML2JSON conversion impossible. The only
     * solution I currently found was to replace all ‘default’  parameters within
     * the XML string to ‘def’ prior to converting to JSON. I am assuming the
     * problem is from the XML2JSON plugin’s use of the dot operator instead of
     * the array-access syntax to do the parsing, but debugging the plugin is
     * not working – there are only two xml->json parsers and I have tested
     * both. Everything works fine on the desktop side, but once placed within
     * PhoneGap the bug comes up.
     */
    var cleanXML = campaign.xml.replace(/<default>/g, "<defaultValue>")
                               .replace(/<\/default>/g, "</defaultValue>");

    //Convert the XML configuration to a JSON representation.
    var json = $.xml2json.parser(cleanXML);

    this.campaign     = campaign;
    this.campaignXML  = json.campaign;


    this.render = function(container){

        var campaignURN = this.getURN();

        var surveys = this.getSurveys();

        var surveyMenu = mwf.decorator.Menu("Available Surveys");

        var callback = function(surveyID){
            return function(){
                PageNavigation.openSurveyView(campaignURN, surveyID);
            };
        };

        //Iterate through each of the campaign's surveys
        //and add it to the menu.
        for(var i = 0; i < surveys.length; i++){
            surveyMenu.addMenuLinkItem(surveys[i].title, null, surveys[i].description).onclick = callback(surveys[i].id);;
        }

        container.appendChild(surveyMenu);
    };

    /**
     * Returns surveys associated with this campaign.
     */
    this.getSurveys = function(){

        //Get the list of surveys from the campaign.
        var surveys  = this.campaignXML.surveys.survey;

        //If survey is returned as a single item, then go ahead and place
        //it in an array. This is a kind of a dirty fix, if you have any
        //better ideas of approaching the situation - please be my guest.
        return (!surveys.length)? [surveys] : surveys;
    };

    /**
    * Returns a survey associated with the provided survey ID. If the campaign,
    * doesn't contain a survey with the provided ID, a null value will be
    * returned.
    */
    this.getSurvey = function(id){

       //Get a list of all the possible surveys.
       var surveys = this.getSurveys();

       //Iterate through the list of retrieved surveys. If a ID match is found,
       //return the survey.
       for(var i = 0; i < surveys.length; i++)
       {
          if(surveys[i].id == id)
          {
              return new Survey(surveys[i], this);
          }
       }

       //If no match was found, return null.
       return null;
    };

    /**
     * Returns the URN for this campaign.
     */
    this.getURN = function(){
        return this.campaignXML["campaignurn"];
    };

    /**
     * Return's the campaign's creation timestamp.
     */
    this.getCreationTimestamp = function(){
        return campaign.creation_timestamp;
    };

    /**
     * Returns the description for this campaign.
     */
    this.getDescription = function(){
        return campaign.description;
    };


}

Campaign.init = function(urn, callback){
    Campaigns.init(function(campaigns){
       callback(campaigns.getCampaign(urn));
    });
};

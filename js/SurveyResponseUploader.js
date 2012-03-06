/**
 * SurveyResponseUploader is responsible for the actual upload of the response
 * data.
 */
function SurveyResponseUploader(survey, surveyResponse){

    var auth = new UserAuthentication();

    //Add the necesssary form input elements.
    var data = {
                    campaign_urn:surveyResponse.getCampaignURN(),
                    campaign_creation_timestamp: survey.getCampaign().getCreationTimestamp(),
                    user: auth.getUsername(),
                    password: auth.getHashedPassword(),
                    client: 'MWoC',
                    surveys:  JSON.stringify([surveyResponse.getUploadData()])
               }




    this.upload = function(callback){

        $.ajax({
          type: 'POST',
          url: url,
          data: data,
          success: success,
          dataType: dataType
        });

    }

}
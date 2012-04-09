/**
 * SurveyResponseUploader is responsible for the actual upload of the response
 * data.
 */
function SurveyResponseUploader(survey, surveyResponse){

    var auth = new UserAuthentication();

    var responseData = surveyResponse.getUploadData();

    var data = {
                    campaign_urn:surveyResponse.getCampaignURN(),
                    campaign_creation_timestamp: survey.getCampaign().getCreationTimestamp(),
                    user: auth.getUsername(),
                    password: auth.getHashedPassword(),
                    client: 'MWoC',
                    surveys:  JSON.stringify([responseData.responses]),
                    images:  JSON.stringify(responseData.images)
               };

    this.upload = function(callback){

        api(
             "POST",
             SURVEY_UPLOAD_URL,
             data,
             "JSON",
             callback,
             callback
        );

    };

}
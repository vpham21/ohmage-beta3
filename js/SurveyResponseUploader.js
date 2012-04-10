/**
 * SurveyResponseUploader is responsible for the actual upload of the response
 * data.
 */
var SurveyResponseUploader = function(survey, surveyResponse){

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

};

SurveyResponseUploader.uploadAll = function(pendingResponses, callback){

    var count = 0;

    //Construct an array of IDs. This allows much easier access with an index.
    var uuidList = [];
    for(var uuid in pendingResponses){
        uuidList.push(uuid);
    }

    var upload = function(i){

        if(i >= uuidList.length){

            if(callback)
                callback(count);

        }else{

            var survey   = pendingResponses[uuidList[i]].survey;
            var surveyResponse = pendingResponses[uuidList[i]].response;

            (new SurveyResponseUploader(survey, surveyResponse)).upload(function(response){

                 if(response.result === "success"){
                    count++;
                    SurveyResponse.deleteSurvey(surveyResponse);
                }

                upload(++i);
            });

        }

    };

    upload(0);


}
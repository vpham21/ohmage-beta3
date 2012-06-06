/**
 * SurveyResponseUploader is responsible for the actual upload of the response
 * data.
 */
var SurveyResponseUploader = function(survey, surveyResponse){

    var responseData = surveyResponse.getUploadData();

    console.log(JSON.stringify([responseData.responses]));
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

        var _callback = function(response){
            Spinner.hide();

            if(callback){
                callback(response);
            }
        };

        Spinner.show();

        api(
             "POST",
             SURVEY_UPLOAD_URL,
             data,
             "JSON",
             _callback,
             _callback
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
            Spinner.hide();
            if(callback){
                callback(count);
            }
        }else{

            var survey   = pendingResponses[uuidList[i]].survey;
            var surveyResponse = pendingResponses[uuidList[i]].response;

            (new SurveyResponseUploader(survey, surveyResponse)).upload(function(response){

                 if(response.result === "success"){
                    count++;
                    SurveyResponse.deleteSurveyResponse(surveyResponse);
                }

                upload(++i);
            });

        }

    };

    Spinner.show();
    upload(0);


}
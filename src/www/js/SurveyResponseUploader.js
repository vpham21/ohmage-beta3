/**
 * SurveyResponseUploader is responsible for the actual upload of the response
 * data.
 */
var SurveyResponseUploader = function(survey, surveyResponse){

    /**
     * Compiles and returns an upload package with the current values set in the
     * survey response. In this case, no extra check of validity or availaility
     * of GPS location will be done - what you see, is what you get.
     */
    var getResponseData = function(){

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

        return data;

    };

    /**
     * Recursively tries to acquire the user's current geolocation until GPS
     * location is successfuly acquired or the user chooses to quit trying.
     *
     * @param At base case, callback will be invoked with a single boolean
     *        parameter indicating the success or failure of the call.
     */
    var setResponseLocation = function(callback){

        //Show the spinner while trying to acquire user's GPS location.
        Spinner.show();

        //Start the Geolocation process.
        surveyResponse.setLocation(function(success){

            //On response, hide the spinner.
            Spinner.hide();

            //If the GPS location was succsesfuly set, then invoke the
            //callback and exit.
            if(success){
                callback(true);


            //In case the geolocation process timed out or was unsuccessful,
            //then ask the user if he/she would like to retry the process.
            }else{

                var errorMessage = "Geolocation failed. Would you like \n\
                                    to try again?"

                showConfirm(errorMessage, function(yes){

                    //In case the user chooses to try the geolocation process
                    //again, then recursively call this function.
                    if(yes){
                        setResponseLocation(callback);

                    //If the user is tired of trying and quits, invoke the
                    //callback indicating failure.
                    }else{
                        callback(false);
                    }
                }, "Yes,No");


            }
        });

    };

    var getFinalizedUploadResponse = function(callback, requireLocation){

        //By default, do not require location.
        requireLocation = typeof requireLocation == 'undefined' ?
                                                                false
                                                              : requireLocation;

        var returnResponseData = function(){
            callback(getResponseData());
        };

        //If the survey response does not have a valid location and the location
        //parameter is required, then ask the user if he/she wants to try to
        //get the GPS location for the survey.
        if(!surveyResponse.isLocationAvailable() && requireLocation){

            var message = "Survey '" + survey.getTitle() + "' does not have \n\
                           a valid GPS location. Would you like to try set it?";

            var confirmCallback = function(yes){

                //If the user wants to get the current GPS location, then try
                //to acquire the current GPS location.
                if(yes){

                    setResponseLocation(function(){
                        returnResponseData();
                    });

                }else{
                    returnResponseData();
                }
            };

            showConfirm(message, confirmCallback, "Yes,No");

        //If validity of survey response location is not required or is
        //correctly set, then invoke the callback with the upload response data.
        }else{
            returnResponseData();
        }
    };

    this.upload = function(callback, requireLocation){

        getFinalizedUploadResponse(function(data){

            //Callback from the API request.
            var _callback = function(response){
                Spinner.hide(function(){
                    if(callback){
                        callback(response);
                    }
                });
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
        }, requireLocation);

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
            Spinner.hide(function(){
                if(callback){
                    callback(count);
                }
            });

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
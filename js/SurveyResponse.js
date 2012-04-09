/**
 * The class represents the responses gathered from the user for a particular
 * survey.
 *
 * @author Zorayr Khalapyan
 *
 * @param id
 * @param uuid The unique identifier for this survey response.
 * @param urn The URN of the campaign associated with this survey.
 */
function SurveyResponse(id, uuid, urn)
{

    /**
     * This variable utilizes JavaScript's closure paradigm to allow private
     * methods to invoke public methods.
     */
    var me = this;

    /**
     * Working data of the survey response. Saving and restoring surveys from
     * local storage will only save and restore this data object.
     */
    this.data = {};

    /**
     * An optional variable that associates this survey response with the
     * surveys' comapaign. This value should be used to create a Survey object
     * from a SurveyResponse object.
     */
    this.data.campaign_urn = urn;

    /**
     * Enumaration object that describes location status.
     * ToDo: Move this to static scope.
     */
    var LocationStatus =
    {
        //If the status is unavailable,
        //it is an error to send a location object.
        UNAVAILABLE : "unavailable",

        VALID       : "valid",
        INACCURATE  : 'inaccurate',
        STALE       : 'stale'

    };

    /**
     * A UUID unique to this survey response.
     */
    this.data.survey_key = uuid;

    /**
     * A string defining a survey in the campaign's associated configuration
     * file at the XPath /surveys/survey/id.
     */
    this.data.survey_id = id;

    /**
     * A string representing a standard time zone.
     */
    this.data.timezone = jstz.determine_timezone().name();

    /**
     * An int specifying the number of milliseconds since the epoch.
     * This value will be set on survey response submission.
     */
    this.data.time = null;

    /**
     * An array composed of prompt responses and/or repeatable sets. By default
     * user has no responses. This object is not to be confused with the
     * responses object that will be submited to the server.
     */
    this.data._responses = {};

    /**
     * An object with variable properties that describes the survey's launch
     * context. See the trigger framework page for a description of the object's
     * contents. The object must contain the property launch_time.
     */
    this.data.survey_launch_context =
    {
        launch_time     : new Date().getTime(),
        launch_timezone : jstz.determine_timezone().name(),
        active_triggers : []
    };

    /**
     * An object for housing location data.
     */
    this.data.location = null;

    this.setLocation = function()
    {
        mwf.touch.geolocation.getPosition(

            function(pos){

                //Create a new location object to house
                //the location data.
                me.data.location = {};

                //Currently, there is no way of determining the geolocation
                //provider but it's almost always going to be from the GPS
                //device.
                me.data.location.provider = 'GPS';

                me.data.location.latitude  = pos.latitude;
                me.data.location.longitude = pos.longitude;
                me.data.location.accuracy  = pos.accuracy;

                //A string describing location status. Must be one of:
                //unavailable, valid, inaccurate, stale.
                me.data.location_status = LocationStatus.VALID;

                //A long value representing the milliseconds since the epoch at
                //hich time this location value was collected.
                me.data.location.time = new Date().getTime();

                //The timezone ID for the timezone of the device when this
                //location value was collected.
                me.data.location.timezone = jstz.determine_timezone().name();

                me.save();
            },

            //On error, delete the location object if any and also set an
            //appropriate location status.
            function(){

                delete this.data.location;

                this.data.location_status = LocationStatus.UNAVAILABLE;

                me.save();
            }
        );
    };

    /**
     * Returns data that can be uploaded to the surver as response data.
     */
    this.getUploadData = function(){

        //The idea here is that during response collection, responses is treated
        //as an object out of the idea that JavaScript does not support
        //associative arrays and in order to search through a list of objects,
        //it would have taken O(n) time. Instead, we use an object which has
        //key-value pair access time of O(1), but needs some extra conversion
        //before getting uploaded to the surver.
        var responses = [];

        var images = {};

        for (var promptID in this.data._responses) {

            var response = this.data._responses[promptID];

            responses.push({
                prompt_id: promptID,
                value: response.value
            });

            if(response.isImage){
                var base64Image = SurveyResponse.getImage(response.value);
                images[response.value] = base64Image.substring(base64Image.indexOf(',') + 1);
            }
        }

        var surveyResponse = {
            survey_key           : this.data.survey_key,
            time                 : this.data.time,
            timezone             : this.data.timezone,
            location_status      : this.data.location_status,
            location             : this.data.location,
            survey_id            : this.data.survey_id,
            survey_launch_context: this.data.survey_launch_context,

            //Single Prompt Response is a JSON object and not an array. Not sure
            //why so, but its noted by the documentation.
            responses: (responses.length == 1)? responses[0]:responses
        }

        return {"responses" : surveyResponse, "images": images};
    }

    /**
     * Replaces the current working data.
     */
    this.setData = function(data){
        this.data = data;
    };

    /**
     * Returns the current working data. The returned object contains all
     * response identifiying information including campaign URN, location,
     * location status, responses, survey_id, survey_key, survey launch context,
     * time, and timezone.
     */
    this.getData = function(){
        return this.data;
    };

    this.getImages = function(){

        var images = {};

        for (var promptID in this.data._responses) {

            var response = this.data._responses[promptID];


        }

        return images;
    };

    /**
     *
     */
    this.getResponses = function(){
        return this.data._responses;
    };

    /**
     * Saves the current response in the response pool.
     */
    this.save = function(){
        SurveyResponse.saveSurvey(this);
    };

    /**
     * Adds a response to the current response list.
     */
    this.respond = function(promptID, value, isImage){
        this.data._responses[promptID] = {"value": value, "isImage": isImage};
        this.save();
    };

    /**
     * Marks the specified prompt as skipped.
     */
    this.promptSkipped = function(promptID){
        this.respond(promptID, SurveyResponse.SKIPPED_PROMPT_VALUE, false);
    }

    /**
     * Marks the provided prompt as not displayed.
     */
    this.promptNotDisplayed = function(promptID){
        this.respond(promptID, SurveyResponse.NOT_DISPLAYED_PROMPT_VALUE, false);
    }

    /**
     * Returns the recorded response value for the given prompt,
     * or null if not specified.
     */
    this.getResponse = function(promptID){

        return (this.data._responses[promptID])?
                    this.data._responses[promptID].value :
                    null;
    }

    /**
     * Saves the current time as the survey completion time.
     */
    var recordSubmitTime = function()
    {
        me.data.time = new Date().getTime();
    };

    this.submit = function(callback)
    {
        //Save the submit time.
        recordSubmitTime();

        //Save the survey in the pool.
        this.save();

        if(callback){
            callback();
        }

    };

    this.getSurveyID = function(){
      return this.data.survey_id;
    };

    this.getSurveyKey = function(){
        return this.data.survey_key;
    };

    this.isSubmitted = function(){
        return (this.data.time == null)? false : true;
    };

    this.getSubmitDate = function(){
        return (new Date(this.data.time)).toString().substr(0, 24);
    };

    this.getCampaignURN = function(){
        return this.data.campaign_urn;
    };
}

SurveyResponse.createUUID = function() {

    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }

    // Bits 12-15 of the time_hi_and_version field to 0010.
    s[14] = "4";

    // Bits 6-7 of the clock_seq_hi_and_reserved to 01.
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
};

SurveyResponse.init = function(id, urn)
{
    var pool = SurveyResponse.getPool();

    //Create a new UUID to be assigned to the survey.
    var uuid = SurveyResponse.createUUID();

    pool[uuid] = new SurveyResponse(id, uuid, urn);

    SurveyResponse.setPool(pool);

    return pool[uuid];

};

/**
 * The function restores a stored SurveyResponse object.
 */
SurveyResponse.restoreSurvey = function(survey_key)
{
    //Get the survey from the response pool.
    var data = SurveyResponse.getSurvey(survey_key);


    var surveyResponse = new SurveyResponse(data.id,
                                            data.survey_key,
                                            data.campaign_urn);
    surveyResponse.setData(data);

    return surveyResponse;

}

SurveyResponse.getSurvey = function(survey_key)
{
    //Get the pool of saved survey responses.
    var pool = SurveyResponse.getPool();

    return (pool[survey_key])? pool[survey_key] : null;
};

SurveyResponse.saveSurvey = function(survey)
{
    //Get the pool of survey responses.
    var pool = SurveyResponse.getPool();

    //Save the specified survey in the pool, mapped to the UUID of the survey.
    pool[survey.getSurveyKey()] = survey.getData();

    //Save the pool in an external storage.
    SurveyResponse.setPool(pool);
};

SurveyResponse.deleteSurvey = function(survey){
   var pool = SurveyResponse.getPool();

   delete pool[survey.getSurveyKey()];

   SurveyResponse.setPool(pool);
}

SurveyResponse.getPool = function(){
    return (localStorage.pool)? JSON.parse(localStorage.pool): {};
};

SurveyResponse.setPool = function(pool)
{
    localStorage.pool = JSON.stringify(pool);
};

/**
 * Saves the provided image URI and returns a UUID that mapps to that image's
 * URI.
 */
SurveyResponse.saveImage = function(imageURI)
{
    var images = SurveyResponse.getImages();
    var uuid = SurveyResponse.createUUID();

    images[uuid] = imageURI;

    SurveyResponse.setImages(images);

    return uuid;
};

SurveyResponse.getImage = function(uuid){
    return SurveyResponse.getImages()[uuid];
};

SurveyResponse.setImages = function(images){
    localStorage.images = JSON.stringify(images);
};

SurveyResponse.getImages = function()
{
    return (localStorage.images)? JSON.parse(localStorage.images) : {};
};

/**
 * Value tag that indicates skipped prompt response value.
 */
SurveyResponse.SKIPPED_PROMPT_VALUE = "SKIPPED";

/**
* Value tag that indicates not displayed prompt response value.
*/
SurveyResponse.NOT_DISPLAYED_PROMPT_VALUE = "NOT_DISPLAYED";

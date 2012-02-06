
function SurveyResponse(id, uuid)
{
    /**
     * This variable utilizes JavaScript's closure paradigm to allow private
     * methods to invoke public methods.
     */
    var me = this;

    /**
     * Enumaration object that describes location status.
     * ToDo: Move this to static scope.
     */
    var LocationStatus =
    {
        //If the status is unavailable, it is an error to send a location object.
        UNAVAILABLE : "unavailable",

        VALID       : "valid",
        INACCURATE  : 'inaccurate',
        STALE       : 'stale'

    };

    /**
     * A UUID unique to this survey response.
     */
    this.survey_key = uuid || SurveyResponse.createUUID();

    /**
     * A string defining a survey in the campaign's associated configuration file
     * at the XPath /surveys/survey/id.
     */
    this.survey_id = id;

    /**
     * A string representing a standard time zone.
     */
    this.timezone = jstz.determine_timezone().name();

    /**
     * An int specifying the number of milliseconds since the epoch.
     * This value will be set on survey response submission.
     */
    this.time = null;

    /**
     * An array composed of prompt responses and/or repeatable sets. By default
     * user has no responses.
     */
    this.responses = {};

    /**
     * An object with variable properties that describes the survey's launch
     * context. See the trigger framework page for a description of the object's
     * contents. The object must contain the property launch_time.
     */
    this.survey_lauch_context =
    {
        launch_time     : new Date().getTime(),
        launch_timezone : jstz.determine_timezone().name(),
        active_triggers : []
    };

    /**
     * An object for housing location data.
     */
    this.location = null;

    this.setLocation = function()
    {

        mwf.touch.geolocation.getPosition(
            function(pos){

                //Create a new location object to house
                //the location data.
                me.location = {};

                //Currently, there is no way of determining the geolocation
                //provider but it's almost always going to be from the GPS
                //device.
                me.location.provider = 'GPS';

                me.location.latitude  = pos.latitude;
                me.location.longitute = pos.longitude;
                me.location.accoracy  = pos.accuracy;

                //A string describing location status. Must be one of:
                //unavailable, valid, inaccurate, stale.
                me.location_status = LocationStatus.VALID;

                //A long value representing the milliseconds since the epoch at
                //hich time this location value was collected.
                me.location.time = new Date().getTime();

                //The timezone ID for the timezone of the device when this
                //location value was collected.
                me.location.timezone = jstz.determine_timezone().name();

                me.save();
            },

            //On error, delete the location object if any and also set an
            //appropriate location status.
            function(){

                delete this.location;

                this.location_status = LocationStatus.UNAVAILABLE;

                me.save();
            }
        );
    };

    this.save = function()
    {
        SurveyResponse.saveSurvey(this);
    };

    this.respond = function(promptID, value)
    {
        this.responses[promptID] = value;
        this.save();
    };

    /**
     * Saves the current time as the survey completion time.
     */
    this.recordSubmitTime = function()
    {
        this.time = new Date().getTime();
    };

    this.submit = function(callback)
    {

    };
}

SurveyResponse.createUUID = function() {

    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }

    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
};

SurveyResponse.init = function(id)
{
    var pool = SurveyResponse.getPool();

    //Create a new UUID to be assigned to the survey.
    var uuid = SurveyResponse.createUUID();


    pool[uuid] = new SurveyResponse(id, uuid);
    SurveyResponse.setPool(pool);

    return pool[uuid];


};

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
    pool[survey.survey_id] = survey;

    //Save the pool in an external storage.
    SurveyResponse.setPool(pool);
};

SurveyResponse.getPool = function()
{
    return (localStorage.pool)? JSON.parse(localStorage.pool): {};
};

SurveyResponse.setPool = function(pool)
{
    localStorage.pool = JSON.stringify(pool);
};

/**
 * Saves the provided image URI and returns a UUID that mapps to that image's
 * URI.
 *
 */
SurveyResponse.saveImage = function(imageURI)
{
    var images = SurveyResponse.getImages();
    var uuid = SurveyResponse.createUUID();

    images[uuid] = imageURI;

    SurveyResponse.setImages(images);

    return uuid;
};

SurveyResponse.setImages = function(images)
{
    localStorage.images = JSON.stringify(images);
}

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
